import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isOpen = false;
  active = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  toggle(event: any) {
    this.isOpen = !this.isOpen;
  }

  toggleActive() {
    console.log('Toggle Active');
    this.active = !this.active;
  }

  logout() {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: '🏃‍♂️ Logout 🏃‍♂️',
          message: 'Do you want to continue?',
          action: 'confirmation',
          action_yes: 'Yes',
          action_no: 'No',
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe(
        (response) => {
          console.log(response);

          if (response !== false) {
            this.authService.logout();
            return this.openSnackBar(
              'You are succesfully logged out.',
              'Got It!'
            );
          }
        },
        (err) => {
          alert(err.error.message);
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
