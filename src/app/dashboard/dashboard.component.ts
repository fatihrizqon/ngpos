import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AppService } from '../services/app.service';
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

  constructor(private appService: AppService) {}

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
}
