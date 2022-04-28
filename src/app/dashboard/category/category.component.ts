import { ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from './dialog/dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, AfterViewInit {
  category?: string;
  categories: any;
  displayedCategories: string[] = ['id', 'name', 'products', 'option'];
  categoriesDataSource: any;
  progress = false;

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

  @ViewChild('categoriesPaginator') categoriesPaginator?: MatPaginator;
  @ViewChild('categoriesSort') categoriesSort?: MatSort;

  ngOnInit() {
    this.getCategories();
  }

  ngAfterViewInit() {
    this.getCategories();
  }

  getCategories() {
    this.appService.getCategories().subscribe(
      (response) => {
        this.categories = response.data;
        this.categoriesDataSource = new MatTableDataSource(this.categories);
        this.categoriesDataSource.paginator = this.categoriesPaginator;
        this.categoriesDataSource.sort = this.categoriesSort;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  getCategory(id: number) {
    return this.categories.find((category: any) => category.id === id);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
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
      .open(CategoryDialogComponent, {
        data: {
          title: 'Create a New Category',
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
            this.getCategories();
            this.openSnackBar(response.message, 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  importCategories() {
    const dialogRef = this.dialog
      .open(CategoryDialogComponent, {
        data: {
          title: 'Import Categories',
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
            this.getCategories();
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
      .open(CategoryDialogComponent, {
        data: {
          title: 'Update Category',
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
            this.getCategories();
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
          title: 'Delete Category',
          message: 'Do you want to Delete this Category?',
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
              this.getCategories();
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
