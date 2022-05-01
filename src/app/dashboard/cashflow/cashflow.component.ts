import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';
import { AppService } from 'src/app/services/app.service';
import { CashflowDialogComponent } from './dialog/dialog.component';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['./cashflow.component.scss'],
})
export class CashflowComponent implements OnInit, AfterViewInit {
  user!: User;
  cashflows: any;
  displayedCashflows: string[] = [
    'id',
    'operation',
    'debit',
    'credit',
    'balance',
    'operator',
    'notes',
    'created_at',
    'updated_at',
    'option',
  ];
  cashflowsDataSource: any;
  progress = false;
  currentDate: any;

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  filtered: any;

  get fromDate() {
    return this.filterForm.get('fromDate');
  }
  get toDate() {
    return this.filterForm.get('toDate');
  }

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar
  ) {
    this.currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en-US', '+0700');
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      this.openSnackBar(
        'Your login session has been expired, please re-login.',
        'Got It'
      );
    }
  }

  @ViewChild('cashflowsPaginator') cashflowsPaginator?: MatPaginator;
  @ViewChild('cashflowsSort') cashflowsSort?: MatSort;

  ngOnInit() {
    this.getCashflows();
  }

  ngAfterViewInit() {
    this.getCashflows();
  }

  getCashflows() {
    this.appService.getCashflows().subscribe(
      (response) => {
        this.cashflows = response.data;
        this.cashflowsDataSource = new MatTableDataSource(this.cashflows);
        this.cashflowsDataSource.paginator = this.cashflowsPaginator;
        this.cashflowsDataSource.sort = this.cashflowsSort;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  cashflow() {
    this.appService.getCashflows().subscribe(
      (response) => {
        this.cashflows = response.data;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.cashflowsDataSource.filter = filterValue.trim().toLowerCase();
  }

  getDateRange(value) {
    const fromDate = value.fromDate;
    const toDate = value.toDate;
    if (!fromDate || !toDate) {
      return this.openSnackBar('Please select a valid Date Range.', 'Got It!');
    }

    this.filtered = this.cashflows.filter((entry) => {
      const time = new Date(entry['created_at']).getTime();
      return time >= fromDate && time <= toDate;
    });

    this.cashflowsDataSource = new MatTableDataSource(this.filtered);
    this.cashflowsDataSource.paginator = this.cashflowsPaginator;
    this.cashflowsDataSource.sort = this.cashflowsSort;
    this.cashflow();
    this.openSnackBar('Selected data has been loaded.', 'Got It!');
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  create() {
    const dialogRef = this.dialog
      .open(CashflowDialogComponent, {
        data: {
          title: 'Create a New Cashflow',
          action: 'create',
          action_no: 'Cancel',
          action_yes: 'Submit',
        },

        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (response) => {
          if (response !== false) {
            this.getCashflows();
            this.openSnackBar(response.message, 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  update(row: any) {
    const dialogRef = this.dialog
      .open(CashflowDialogComponent, {
        data: {
          title: 'Update Cashflow',
          row: row,
          action: 'confirmation',
          action_no: 'Cancel',
          action_yes: 'Save',
        },

        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (response) => {
          if (response !== false) {
            this.getCashflows();
            this.openSnackBar(response.message, 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  delete(id: number) {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: 'Delete Cashflow',
          message: 'Do you want to Delete this Cashflow?',
          action: 'confirmation',
          action_yes: 'Yes',
          action_no: 'No',
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response === true) {
          this.appService.deleteCashflow(id).subscribe(
            (response) => {
              this.getCashflows();
              this.progress = false;
              this.openSnackBar(response.message, 'Got It!');
            },
            (err) => {
              this.progress = false;
              console.log(err.error.message);
              this.openSnackBar(err.error.message, 'Got It!');
            }
          );
        }
      });
  }

  report() {
    var data;
    if (this.filtered !== undefined) {
      data = this.filtered;
    } else {
      data = this.cashflows;
    }
    if (data.length === 0) {
      return this.openSnackBar(
        'Cannot Export an empty data, please check your data again.',
        'Got It!'
      );
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cashflow Reports');

    let buff = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    XLSX.writeFile(workbook, 'Cashflow Reports ' + this.currentDate + '.xlsx');
    return this.openSnackBar(
      'Exporting to Spreadsheet, please wait.',
      'Got It!'
    );
  }

  reset() {
    this.filtered = undefined;
    this.getCashflows();
    this.filterForm.reset();
    this.openSnackBar('All filters has been cleared.', 'Got It!');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
