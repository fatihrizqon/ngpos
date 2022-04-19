import { ViewChild, Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SupplyDialogComponent } from './dialog/dialog.component';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.scss'],
})
export class SupplyComponent implements OnInit {
  supplies: any;
  products: any;
  displayedColumns: string[] = [
    'id',
    'product',
    'quantity',
    'supplier',
    'stocker',
    'total',
    'date',
    'update',
    'option',
  ];
  dataSource: any;
  progress = false;

  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  ngOnInit(): void {
    this.getSupplies();
    this.getProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getSupplies() {
    this.appService.getSupplies().subscribe(
      (response) => {
        this.supplies = response.data;
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        if (err.error.message) {
          console.log(err.error.message);
        }
      }
    );
  }

  getProducts() {
    this.appService.getProducts().subscribe(
      (response) => {
        this.products = response.data;
      },
      (err) => {
        if (err.error.message) {
          console.log(err.error.message);
        }
      }
    );
  }

  create() {
    const dialogRef = this.dialog
      .open(SupplyDialogComponent, {
        data: {
          title: 'Create a New Supply',
          action: 'create',
          action_no: 'Cancel',
          action_yes: 'Submit',
        },
        width: '33%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (response) => {
          if (response !== false) {
            this.getSupplies();
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
      .open(SupplyDialogComponent, {
        data: {
          title: 'Update Supply',
          row: row,
          action: 'update',
          action_no: 'Cancel',
          action_yes: 'Save',
        },
        width: '33%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (response) => {
          if (response !== false) {
            this.getSupplies();
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
          title: 'Delete Supply',
          message: 'Do you want to Delete this Supply?',
          action_yes: 'Yes',
          action_no: 'No',
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response === true) {
          this.progress = true;
          this.appService.deleteSupply(id).subscribe(
            (response) => {
              this.getSupplies();
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
