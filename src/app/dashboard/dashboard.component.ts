import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  openDialog() {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: 'Caution',
          message: 'You are not authorized to visit this page.',
          action: 'caution',
          action_yes: 'Got It!',
          action_no: 'No',
        },
        disableClose: false,
      })
      .afterClosed();
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
}
