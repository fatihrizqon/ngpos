import { ViewChild, Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SupplyDialogComponent } from './dialog/supply.component';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierDialogComponent } from './dialog/supplier.component';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.scss'],
})
export class SupplyComponent implements OnInit {
  supplies: any;
  suppliers: any;
  products: any;
  displayedSupplies: string[] = [
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

  displayedSuppliers: string[] = [
    'id',
    'name',
    'address',
    'email',
    'contact',
    'created_at',
    'updated_at',
    'option',
  ];

  suppliesDataSource: any;
  suppliersDataSource: any;

  progress = false;

  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar
  ) {}

  // @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  // @ViewChild(MatSort) sort: MatSort | undefined;

  @ViewChild('suppliesPaginator') suppliesPaginator?: MatPaginator;
  @ViewChild('suppliesSort') suppliesSort?: MatSort;

  @ViewChild('suppliersPaginator') suppliersPaginator?: MatPaginator;
  @ViewChild('suppliersSort') suppliersSort?: MatSort;

  ngOnInit(): void {
    this.getSupplies();
    this.getSuppliers();
    this.getProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.suppliesDataSource.filter = filterValue.trim().toLowerCase();
    this.suppliersDataSource.filter = filterValue.trim().toLowerCase();
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
        this.suppliesDataSource = new MatTableDataSource(response.data);
        this.suppliesDataSource.paginator = this.suppliesPaginator;
        this.suppliesDataSource.sort = this.suppliersSort;
      },
      (err) => {
        if (err.error.message) {
          console.log(err.error.message);
        }
      }
    );
  }

  getSuppliers() {
    this.appService.getSuppliers().subscribe(
      (response) => {
        this.suppliers = response.data;
        this.suppliersDataSource = new MatTableDataSource(response.data);
        this.suppliersDataSource.paginator = this.suppliersPaginator;
        this.suppliersDataSource.sort = this.suppliersSort;
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

  createSupply() {
    const dialogRef = this.dialog
      .open(SupplyDialogComponent, {
        data: {
          title: 'Create a New Supply',
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
            this.getSupplies();
            this.openSnackBar(response.message, 'Got It!');
          }
        },
        (err) => {
          alert(err.error.message);
        }
      );
  }

  updateSupply(row: any) {
    const dialogRef = this.dialog
      .open(SupplyDialogComponent, {
        data: {
          title: 'Update Supply',
          row: row,
          action: 'update',
          action_no: 'Cancel',
          action_yes: 'Save',
        },

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

  deleteSupply(id: number) {
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

  createSupplier() {
    const dialogRef = this.dialog
      .open(SupplierDialogComponent, {
        data: {
          title: 'Create a New Supplier',
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
            this.getSuppliers();
            this.openSnackBar(response.message, 'Got It!');
          }
        },
        (err) => {
          alert(err.error.message);
        }
      );
  }

  updateSupplier(row: any) {
    const dialogRef = this.dialog
      .open(SupplierDialogComponent, {
        data: {
          title: 'Update Supplier',
          row: row,
          action: 'update',
          action_no: 'Cancel',
          action_yes: 'Save',
        },

        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (response) => {
          if (response !== false) {
            this.getSuppliers();
            this.openSnackBar(response.message, 'Got It!');
          }
        },
        (err) => {
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  deleteSupplier(id: number) {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: 'Delete Supplier',
          message: 'Do you want to Delete this Supplier?',
          action_yes: 'Yes',
          action_no: 'No',
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response === true) {
          this.progress = true;
          this.appService.deleteSupplier(id).subscribe(
            (response) => {
              this.getSuppliers();
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
