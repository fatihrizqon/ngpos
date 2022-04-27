import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/interfaces/User';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserDialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  user!: User;
  progress = false;
  users: any;
  displayedUsers: string[] = [
    'id',
    'name',
    'gender',
    'email',
    'phone',
    'role',
    'created_at',
    'option',
  ];
  usersDataSource: any;

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

  @ViewChild('usersPaginator') usersPaginator?: MatPaginator;
  @ViewChild('usersSort') usersSort?: MatSort;

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.appService.getUsers().subscribe(
      (response) => {
        this.users = response.data;
        this.usersDataSource = new MatTableDataSource(this.users);
        this.usersDataSource.paginator = this.usersPaginator;
        this.usersDataSource.sort = this.usersSort;
      },
      (err) => {
        console.log(err.error.message);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  update(row: any) {
    const dialogRef = this.dialog
      .open(UserDialogComponent, {
        data: {
          title: 'Update User',
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
            this.getUsers();
            this.openSnackBar(response.message, 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  delete(row: any) {}

  /**


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
   */

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
