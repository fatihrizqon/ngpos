import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Order } from '../interfaces/Order';
import { Product } from '../interfaces/Product';
import { AppService } from '../services/app.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../layouts/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss'],
})
export class CashierComponent implements OnInit {
  index!: number;
  createOrder = true;
  products!: Product[];
  order_code!: String;
  order: Order[] = [];
  orders: any[] = [];
  total_items!: any;
  total_quantity!: any;
  total_price!: any;
  savedOrders: any[] = [];
  quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  quantity!: number;
  query: any;
  disableProducts = true;
  clicked = false;
  spinner = false;
  currentDate!: String;
  return: number = 0;
  pay: number = 0;
  orderDataSource: any;
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
  user: {
    id: number;
    username: string;
    fullname: string;
    email: string;
    phone: string;
    role: number;
  };

  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.currentDate = formatDate(
      new Date(),
      'dd/MM/yyyy HH:mm:ss',
      'en-US',
      '+0700'
    );
    this.user = {
      id: 1,
      username: 'misha',
      fullname: 'Misha Anastashya',
      email: 'misha@mail.id',
      phone: '082145556225',
      role: 5,
    };
  }

  ngOnInit(): void {
    this.getProducts();

    this.filteredOptions = this.searchForm.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.savedOrders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  newOrder() {
    this.order = [];
    this.getProducts();
    this.reset();
    this.createOrder = false;
    this.order_code = this.generateCode();
  }

  getProducts() {
    this.appService.getProducts().subscribe(
      (response) => {
        this.products = response.data;
        this.options = this.products.map((product: any) => product.code);
      },
      (err) => {
        if (err.error.message) {
          alert(err.error.message);
        }
      }
    );
  }

  addItem() {
    this.clicked = false;
    var code = this.order_code;
    var quantity = 1;
    var keyword = this.searchForm.value;
    var product = this.products.find((product) => product.code === keyword);

    const check = this.order.find(
      (x) => x.product_code == this.searchForm.value
    );

    if (product!.stocks === 0) {
      return this.openSnackBar('Selected product is out of stock!', 'Got It!');
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
        code: code,
      };

      const newItem = JSON.parse(JSON.stringify(item));
      this.order.push(newItem);
      this.searchForm.setValue('');
      return this.refresh();
    }
  }

  addQty(i: number) {
    this.clicked = false;
    var product_id = this.order[i].product_id;
    var product = this.products.find((product) => product.id === product_id);
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
    this.createOrder = false;
    this.order = this.orders[i];
    this.pay = 0;
    this.return = 0;
    this.refresh();
    this.order_code = this.savedOrders[i];
    return this.openSnackBar('Selected Order has been loaded.', 'Got It!');
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
    // demo ulang, masih ada error.
    if (message) {
      return this.openSnackBar(message, 'Got It!');
    } else {
      const dialogRef = this.dialog
        .open(DialogComponent, {
          width: '550px',
          data: {
            title: 'Clear Item(s)',
            message: 'Do you want to proceed this action?',
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
              return this.openSnackBar(
                'Order list has been cleared.',
                'Got It!'
              );
            }
          },
          (err) => {
            alert(err.error.message);
          }
        );
    }
  }

  removeOrder(i: number) {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: 'Delete a Saved Order',
          message: 'Do you want to proceed this action?',
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
            this.orderDataSource = undefined;
            this.newOrder();
            localStorage.setItem('orders', JSON.stringify(this.orders));
            this.openSnackBar('An Order has been deleted.', 'Got It!');
          }
        },
        (err) => {
          alert(err.error.message);
        }
      );
  }

  refresh() {
    if (this.index !== undefined) {
      if (this.orders[this.index].length < 1) {
        this.total_items = 0;
        this.total_quantity = 0;
        this.total_price = 0;
      }
      this.total_items = this.orders[this.index].length;
      this.total_quantity = this.orders[this.index].reduce(
        (acc: any, curr: any) => acc + curr.quantity,
        0
      );
      this.total_price = this.orders[this.index].reduce(
        (acc: any, curr: any) => acc + curr.quantity * curr.price,
        0
      );
      this.orderDataSource = new MatTableDataSource(this.orders[this.index]);
    } else {
      if (this.order.length < 1) {
        this.total_items = 0;
        this.total_price = 0;
        this.total_quantity = 0;
      }
      this.total_items = this.order.length;
      this.total_quantity = this.order.reduce(
        (acc: any, curr: any) => acc + curr.quantity,
        0
      );
      this.total_price = this.order.reduce(
        (acc: any, curr: any) => acc + curr.quantity * curr.price,
        0
      );
      this.orderDataSource = new MatTableDataSource(this.order);
    }
  }

  reset() {
    this.order = [];
    if (this.index) {
      this.order = [];
      this.orders[this.index] = [];
    }
    this.pay = 0;
    this.return = 0;
    this.total_items = 0;
    this.total_quantity = 0;
    this.total_price = 0;
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

  checkOut() {
    this.pay = this.paymentForm.value;
    if (this.pay < this.total_price) {
      this.pay = 0;
      this.return = 0;
      return this.openSnackBar('Insufficient fund.', 'Got It!');
    } else if (this.order.length === 0) {
      this.pay = 0;
      this.return = 0;
      return this.openSnackBar('The order is empty.', 'Got It!');
    } else {
      this.return = this.paymentForm.value - this.total_price;
      const dialogRef = this.dialog
        .open(DialogComponent, {
          width: '550px',
          data: {
            title: 'Check Out',
            message: 'Do you want to proceed this transaction?',
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
                total_price: this.total_price,
                pay: this.pay,
                return: this.return,
                user_id: this.user.id,
              };

              for (let i = 0; i < this.order.length; i++) {
                this.spinner = true;
                this.appService.newOrder(this.order[i]).subscribe(
                  (response) => {},
                  (err) => {
                    this.openSnackBar(err.error.message, 'Got It!');
                  }
                );

                if (i === this.order.length - 1) {
                  this.appService.newTransaction(transaction).subscribe(
                    (response) => {
                      this.spinner = false;
                      this.newOrder();
                      this.removeOrder(this.index);
                      this.clearOrder(response.message);
                      this.createOrder = true;
                      this.orderDataSource = undefined;
                    },
                    (err) => {
                      this.openSnackBar(err.error.message, 'Got It!');
                    }
                  );
                }
              }
            }
          },
          (err) => {
            this.openSnackBar(err.error.message, 'Got It!');
          }
        );
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
