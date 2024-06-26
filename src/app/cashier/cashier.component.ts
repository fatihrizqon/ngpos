import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Order } from '../interfaces/Order';
import { Product } from '../interfaces/Product';
import { AppService } from '../services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../layouts/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import * as html2pdf from 'html2pdf.js';
import { User } from '../interfaces/User';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss'],
})
export class CashierComponent implements OnInit, OnDestroy {
  index!: any;
  total_products!: any;
  total_items!: any;
  revenue!: any;
  orderDataSource: any;

  createOrder = true;
  clicked = false;
  spinner = false;

  order_code!: String;
  currentDate!: String;

  pay: number = 0;
  quantity!: number;
  return: number = 0;

  savedOrders: any[] = [];
  orders: any[] = [];
  order: Order[] = [];
  user: User;
  products!: Product[];
  displayedItems: string[] = [
    'id',
    'product_name',
    'product_code',
    'quantity',
    'price',
    'option',
  ];

  searchForm = new FormControl();
  paymentForm = new FormControl();
  options: string[] = [];
  filteredOptions!: Observable<string[]>;

  @ViewChild('invoice', { static: false })
  invoice!: ElementRef<HTMLImageElement>;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.currentDate = formatDate(
      new Date(),
      'dd/MM/yyyy HH:mm:ss',
      'en-US',
      '+0700'
    );
    this.user = this.authService.userdata();
    this.savedOrders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      this.openSnackBar(
        'Your login session has been expired, please re-login.',
        'Got It'
      );
    }
  }

  ngOnInit(): void {
    this.newOrder();
    this.getProducts();
    this.filteredOptions = this.searchForm.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  newOrder() {
    this.reset();
    this.order_code = this.generateCode();
    this.getProducts();
  }

  generateCode() {
    var date = formatDate(new Date(), 'HHmmssddMMyyyy', 'en-US', '+0700');
    var length = 3;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + date;
  }

  getProducts() {
    this.appService.getProducts().subscribe(
      (response) => {
        this.products = response.data;
        this.options = this.products.map((product: any) => product.code);
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  addItem() {
    this.clicked = false;
    var quantity = 1;
    var product = this.products.find(
      (product) => product.code === this.searchForm.value
    );

    const check = this.order.find(
      (x) => x.product_code == this.searchForm.value
    );

    if (product!.stocks === 0) {
      this.searchForm.setValue('');
      return this.openSnackBar(
        product?.name + ' currently is out of stock!',
        'Got It!'
      );
    }

    if (check) {
      var i = this.order.indexOf(check);
      this.addQty(i);
      this.searchForm.setValue('');
      return this.refresh();
    } else {
      var item = {
        product_id: product?.id,
        product_name: product?.name,
        product_code: product?.code,
        quantity: quantity,
        price: product!.sell * quantity,
        created_at: this.currentDate,
        code: this.order_code,
      };

      const newItem = JSON.parse(JSON.stringify(item));
      this.order.push(newItem);
      this.searchForm.setValue('');
      return this.refresh();
    }
  }

  addQty(i: number) {
    this.clicked = false;
    var product = this.products.find(
      (product) => product.id === this.order[i].product_id
    );
    this.order[i].quantity = this.order[i].quantity + 1;

    if (this.order[i].quantity > product!.stocks) {
      this.order[i].quantity = product!.stocks;
      return this.openSnackBar('Insufficient stock!', 'Got It!');
    }
    return this.refresh();
  }

  reduceQty(i: number) {
    this.clicked = false;
    if (this.order[i].quantity < 2) {
      this.removeItem(i);
      return this.refresh();
    }
    this.order[i].quantity = this.order[i].quantity - 1;
    return this.refresh();
  }

  getOrder(i: number) {
    this.index = i;
    this.order = this.orders[i];
    this.pay = 0;
    this.return = 0;
    this.paymentForm.setValue('');
    this.order_code = this.savedOrders[i];
    this.openSnackBar('Selected Order has been loaded.', 'Got It!');
    return this.refresh();
  }

  removeItem(i: number) {
    this.clicked = false;
    if (this.index !== undefined) {
      this.orders[this.index].splice(i, 1);
      this.refresh();
      return this.openSnackBar('An item has been removed.', 'Got It!');
    }
    this.order.splice(i, 1);
    this.refresh();
    return this.openSnackBar('An item has been removed.', 'Got It!');
  }

  saveOrder() {
    this.clicked = true;
    if (this.order.length === 0) {
      return this.openSnackBar('Cannot save an empty order.', 'Got It!');
    }
    if (this.index !== undefined) {
      localStorage.setItem('orders', JSON.stringify(this.orders));
      return this.openSnackBar('Order Saved.', 'Got It!');
    } else {
      var check = this.savedOrders.find((order) => order === this.order_code);
      if (check === undefined) {
        this.savedOrders.push(this.order_code);
        this.orders.push(this.order);
        localStorage.setItem('savedOrders', JSON.stringify(this.savedOrders));
        localStorage.setItem('orders', JSON.stringify(this.orders));
        return this.openSnackBar('Order Saved.', 'Got It!');
      }
      localStorage.setItem('savedOrders', JSON.stringify(this.savedOrders));
      localStorage.setItem('orders', JSON.stringify(this.orders));
      return this.openSnackBar('Order Saved.', 'Got It!');
    }
  }

  clearOrder(message?: string) {
    if (message) {
      return this.openSnackBar(message, 'Got It!');
    }

    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: 'Clear Item(s)',
          message: 'Do you want to proceed this action?',
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
            this.order = [];
            this.orders[this.index] = [];
            this.refresh();
            return this.openSnackBar('Order list has been cleared.', 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  removeOrder(i: number, message?: string) {
    if (message) {
      this.savedOrders.splice(i, 1);
      this.orders.splice(i, 1);
      localStorage.setItem('savedOrders', JSON.stringify(this.savedOrders));
      localStorage.setItem('orders', JSON.stringify(this.orders));
      this.newOrder();
      return this.openSnackBar(message, 'Got It!');
    }
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: 'Delete a Saved Order',
          message: 'Do you want to proceed this action?',
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
            this.savedOrders.splice(i, 1);
            this.orders.splice(i, 1);
            localStorage.setItem(
              'savedOrders',
              JSON.stringify(this.savedOrders)
            );
            localStorage.setItem('orders', JSON.stringify(this.orders));
            this.newOrder();
            this.openSnackBar('An Order has been deleted.', 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  refresh() {
    if (this.index !== undefined) {
      if (this.orders[this.index].length < 1) {
        this.total_products = 0;
        this.total_items = 0;
        this.revenue = 0;
      }
      this.total_products = this.orders[this.index].length;
      this.total_items = this.orders[this.index].reduce(
        (acc: any, curr: any) => acc + curr.quantity,
        0
      );
      this.revenue = this.orders[this.index].reduce(
        (acc: any, curr: any) => acc + curr.quantity * curr.price,
        0
      );
      this.orderDataSource = new MatTableDataSource(this.orders[this.index]);
    } else {
      if (this.order.length < 1) {
        this.total_products = 0;
        this.revenue = 0;
        this.total_items = 0;
      }
      this.total_products = this.order.length;
      this.total_items = this.order.reduce(
        (acc: any, curr: any) => acc + curr.quantity,
        0
      );
      this.revenue = this.order.reduce(
        (acc: any, curr: any) => acc + curr.quantity * curr.price,
        0
      );
      this.orderDataSource = new MatTableDataSource(this.order);
    }
  }

  checkOut() {
    this.currentDate = formatDate(
      new Date(),
      'dd/MM/yyyy HH:mm:ss',
      'en-US',
      '+0700'
    );
    this.pay = this.paymentForm.value;

    if (this.pay < this.revenue) {
      this.pay = 0;
      this.return = 0;
      return this.openSnackBar('Insufficient fund.', 'Got It!');
    } else if (this.order.length === 0) {
      this.pay = 0;
      this.return = 0;
      return this.openSnackBar('The order is empty.', 'Got It!');
    } else {
      this.return = this.paymentForm.value - this.revenue;
      const dialogRef = this.dialog
        .open(DialogComponent, {
          width: '550px',
          data: {
            title: 'Check Out',
            message: 'Do you want to proceed this transaction?',
            action: 'confirmation',
            action_yes: 'Yes',
            action_no: 'No',
          },
          disableClose: true,
        })
        .afterClosed()
        .subscribe(
          (response) => {
            if (response === true) {
              var transaction = {
                code: this.order_code,
                revenue: this.revenue,
                pay: this.pay,
                return: this.return,
                user_id: this.user.id,
                products: this.total_products,
                items: this.total_items,
              };

              for (let i = 0; i < this.order.length; i++) {
                this.spinner = true;
                this.appService.newOrder(this.order[i]).subscribe(
                  (response) => {},
                  (err) => {
                    console.log(err.error.message);
                    this.openSnackBar(err.error.message, 'Got It!');
                  }
                );

                if (i === this.order.length - 1) {
                  this.saveInvoice();
                  this.appService.newTransaction(transaction).subscribe(
                    (response) => {
                      this.spinner = false;
                      this.removeOrder(this.index, response.message);
                      this.clearOrder(response.message);
                      this.reset();
                      this.newOrder();
                    },
                    (err) => {
                      console.log(err.error.message);
                      this.openSnackBar(err.error.message, 'Got It!');
                    }
                  );
                }
              }
            }
          },
          (err) => {
            console.log(err.error.message);
            this.openSnackBar(err.error.message, 'Got It!');
          }
        );
    }
  }

  saveInvoice() {
    const options = {
      filename: this.order_code + '.pdf',
      html2canvas: {},
      jsPDF: {
        unit: 'mm',
        orientation: 'portrait',
        format: 'A7',
      },
    };
    const content = window.document.getElementById('invoice');
    html2pdf().from(content).set(options).save();
  }

  reset() {
    this.order = [];
    this.pay = 0;
    this.return = 0;
    this.total_products = 0;
    this.revenue = 0;
    this.total_items = 0;
    this.index = undefined;
    this.orderDataSource = undefined;
    this.paymentForm.setValue('');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  ngOnDestroy(): void {
    this.order = [];
    this.pay = 0;
    this.return = 0;
    this.total_products = 0;
    this.revenue = 0;
    this.total_items = 0;
    this.index = undefined;
    this.orderDataSource = undefined;
  }
}
