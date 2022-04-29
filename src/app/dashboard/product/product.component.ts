import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';
import { ProductDialogComponent } from './dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Product } from 'src/app/interfaces/Product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  product!: Product;
  products: any;
  categories: any;
  displayedProducts: string[] = [
    'select',
    'id',
    'name',
    'category',
    'purchase',
    'sell',
    'stocks',
    'supplier',
    'code',
    'created_at',
    'option',
  ];
  productsDataSource: any;
  progress = false;
  selection = new SelectionModel<Product>(true, []);
  selections: any;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar
  ) {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      this.openSnackBar(
        'Your login session has been expired, please re-login.',
        'Got It'
      );
    }
  }

  @ViewChild('productsPaginator') productsPaginator?: MatPaginator;
  @ViewChild('productsSort') productsSort?: MatSort;

  ngOnInit(): void {
    this.getAllProducts();
    this.getCategories();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    this.selections = this.selection.selected;

    const numSelected = this.selection.selected.length;
    const numRows = this.productsDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.productsDataSource.data.forEach((element: any) =>
          this.selection.select(element)
        );
  }

  exportBarcodes() {
    if (this.selection.selected.length === 0) {
      this.selections = undefined;
      return this.openSnackBar(
        'Unable to Print unselected Barcode.',
        'Got It!'
      );
    }

    const dialogRef = this.dialog
      .open(ProductDialogComponent, {
        width: '550px',
        data: {
          title: 'Barcodes Printing',
          datasets: {
            products: this.selections,
          },
          action: 'print',
          action_no: 'Close',
          action_yes: 'Print',
        },

        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (response) => {
          if (response !== false) {
            this.openSnackBar('Selected Barcodes has been printed.', 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  ngAfterViewInit() {
    this.getAllProducts();
    this.getCategories();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsDataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  view(id: number) {
    alert('View QR ' + id);
  }

  getCategories() {
    this.appService.getCategories().subscribe(
      (response) => {
        this.categories = response.data;
      },
      (err) => {
        if (err.error.message) {
          console.log(err.error.message);
        }
      }
    );
  }

  getAllProducts() {
    this.appService.getAllProducts().subscribe(
      (response) => {
        this.products = response.data;
        this.productsDataSource = new MatTableDataSource(response.data);
        this.productsDataSource.paginator = this.productsPaginator;
        this.productsDataSource.sort = this.productsSort;
      },
      (err) => {
        if (err.error.message) {
          console.log(err.error.message);
        }
      }
    );
  }

  printQR(id: number) {
    alert('Print QR Code ' + id);
  }

  create() {
    const dialogRef = this.dialog
      .open(ProductDialogComponent, {
        data: {
          title: 'Create a New Product',
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
            this.getAllProducts();
            this.openSnackBar(response.message, 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  importProducts() {
    const dialogRef = this.dialog
      .open(ProductDialogComponent, {
        data: {
          title: 'Import Products',
          action: 'import',
          action_no: 'Cancel',
          action_yes: 'Submit',
        },

        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (response) => {
          if (response !== false) {
            this.getAllProducts();
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
      .open(ProductDialogComponent, {
        data: {
          title: 'Update Product',
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
            this.getAllProducts();
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
          title: 'Delete Product',
          message: 'Do you want to Delete this Product?',
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
          this.appService.deleteProduct(id).subscribe(
            (response) => {
              this.getAllProducts();
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
