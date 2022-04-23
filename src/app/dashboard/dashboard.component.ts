import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogComponent } from '../layouts/dialog/dialog.component';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';
import { SupplyComponent } from './supply/supply.component';

@Component({
  selector: 'root-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isOpen = false;
  active = false;
  lightMode = true;
  allproducts: any;
  outofstocks: any;
  refresh: any;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.appService.getAllProducts().subscribe(
      (response) => {
        this.allproducts = response.data;
        this.outofstocks = this.allproducts.filter(
          (product: any) => product.stocks < 5
        );
      },
      (err) => {
        console.log(err.error.message);
      }
    );
  }

  toggle(event: any) {
    this.isOpen = !this.isOpen;
  }

  changeMode(event: MatSlideToggleChange): void {
    this.getProducts();
    document.body.classList.toggle('darkMode');
  }

  logout() {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: 'Logout',
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
