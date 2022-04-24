import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';
import { AppService } from 'src/app/services/app.service';
import { CashflowDialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['./cashflow.component.scss'],
})
export class CashflowComponent implements OnInit, AfterViewInit {
  cashflows: any;
  displayedCashflows: string[] = [
    'id',
    'operation',
    'debit',
    'credit',
    'balance',
    'user_id',
    'notes',
    'date',
    'update',
    'option',
  ];
  cashflowsDataSource: any;
  progress = false;

  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar
  ) {}

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
        if (err.error.message) {
          console.log(err.error.message);
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.cashflowsDataSource.filter = filterValue.trim().toLowerCase();
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
          alert(err.error.message);
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
          this.progress = true;
          this.appService.deleteCategory(id).subscribe(
            (response) => {
              this.getCashflows();
              this.progress = false;
              this.openSnackBar(response.message, 'Got It!');
            },
            (err) => {
              this.progress = false;
              this.openSnackBar(err.error.message, 'Got It!');
            }
          );
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
