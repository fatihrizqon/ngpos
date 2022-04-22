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

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  products: any;
  categories: any;
  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'purchase',
    'sell',
    'stocks',
    'supplier',
    'code',
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
    this.getAllProducts();
    this.getCategories();
  }

  ngAfterViewInit() {
    this.getAllProducts();
    this.getCategories();
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
          alert(err.error.message);
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
