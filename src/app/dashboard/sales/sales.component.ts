import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/services/app.service';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { SalesDialogComponent } from './dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit, AfterViewInit {
  transactions: any;
  orders: any;
  displayedTransactions: string[] = [
    'id',
    'order_code',
    'revenue',
    'pay',
    'return',
    'cashier',
    'created_at',
    'updated_at',
    'option',
  ];
  displayedOrders: string[] = [
    'id',
    'product_name',
    'quantity',
    'price',
    'code',
    'created_at',
    'updated_at',
  ];

  transactionsDataSource: any;
  ordersDataSource: any;
  currentDate: string;
  filteredTransactions: any;
  filteredOrders: any;

  transactionsFilterForm = new FormGroup({
    transactionsFromDate: new FormControl(),
    transactionsToDate: new FormControl(),
  });

  ordersFilterForm = new FormGroup({
    ordersFromDate: new FormControl(),
    ordersToDate: new FormControl(),
  });

  get transactionsFromDate() {
    return this.transactionsFilterForm.get('transactionsFromDate');
  }
  get transactionsToDate() {
    return this.transactionsFilterForm.get('transactionsToDate');
  }

  get ordersFromDate() {
    return this.ordersFilterForm.get('ordersFromDate');
  }
  get ordersToDate() {
    return this.ordersFilterForm.get('ordersToDate');
  }

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en-US', '+0700');
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      this.openSnackBar(
        'Your login session has been expired, please re-login.',
        'Got It'
      );
    }
  }

  @ViewChild('transactionsPaginator') transactionsPaginator?: MatPaginator;
  @ViewChild('transactionsSort') transactionsSort?: MatSort;

  @ViewChild('ordersPaginator') ordersPaginator?: MatPaginator;
  @ViewChild('ordersSort') ordersSort?: MatSort;

  ngOnInit(): void {
    this.getTransactions();
    this.getOrders();
  }

  ngAfterViewInit() {
    this.getTransactions();
    this.getOrders();
  }

  getTransactions() {
    this.appService.getTransactions().subscribe(
      (response) => {
        this.transactions = response.data;
        this.transactionsDataSource = new MatTableDataSource(response.data);
        this.transactionsDataSource.paginator = this.transactionsPaginator;
        this.transactionsDataSource.sort = this.transactionsSort;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  transaction() {
    this.appService.getTransactions().subscribe(
      (response) => {
        this.transactions = response.data;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  getOrders() {
    this.appService.getOrders().subscribe(
      (response) => {
        this.orders = response.data;
        this.ordersDataSource = new MatTableDataSource(response.data);
        this.ordersDataSource.paginator = this.ordersPaginator;
        this.ordersDataSource.sort = this.ordersSort;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  order() {
    this.appService.getOrders().subscribe(
      (response) => {
        this.orders = response.data;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  getTransactionsDateRange(value) {
    const transactionsFromDate = value.transactionsFromDate;
    const transactionsToDate = value.transactionsToDate;
    if (!transactionsFromDate || !transactionsToDate) {
      return this.openSnackBar('Please select a valid Date Range.', 'Got It!');
    }

    this.filteredTransactions = this.transactions.filter((entry) => {
      const time = new Date(entry['created_at']).getTime();
      return time >= transactionsFromDate && time <= transactionsToDate;
    });
    this.transactionsDataSource = new MatTableDataSource(
      this.filteredTransactions
    );
    this.transactionsDataSource.paginator = this.transactionsPaginator;
    this.transactionsDataSource.sort = this.transactionsSort;
    this.transaction();
    this.openSnackBar('Selected data has been loaded.', 'Got It!');
  }

  getOrdersDateRange(value) {
    const ordersFromDate = value.ordersFromDate;
    const ordersToDate = value.ordersToDate;
    if (!ordersFromDate || !ordersToDate) {
      return this.openSnackBar('Please select a valid Date Range.', 'Got It!');
    }

    this.filteredOrders = this.orders.filter((entry) => {
      const time = new Date(entry['created_at']).getTime();
      return time >= ordersFromDate && time <= ordersToDate;
    });
    this.ordersDataSource = new MatTableDataSource(this.filteredOrders);
    this.ordersDataSource.paginator = this.ordersPaginator;
    this.ordersDataSource.sort = this.ordersSort;
    this.order();
    this.openSnackBar('Selected data has been loaded.', 'Got It!');
  }

  transactionsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  ordersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ordersDataSource.filter = filterValue.trim().toLowerCase();
  }

  transactionsReport() {
    var data;
    if (this.filteredTransactions !== undefined) {
      data = this.filteredTransactions;
    } else {
      data = this.transactions;
    }

    if (data.length === 0) {
      return this.openSnackBar(
        'Cannot Export an empty data, please check your data again.',
        'Got It!'
      );
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaction Reports');

    let buff = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    XLSX.writeFile(
      workbook,
      'Transaction Reports ' + this.currentDate + '.xlsx'
    );
    return this.openSnackBar(
      'Exporting to Spreadsheet, please wait.',
      'Got It!'
    );
  }

  ordersReport() {
    var data;
    if (this.filteredOrders !== undefined) {
      data = this.filteredOrders;
    } else {
      data = this.orders;
    }

    if (data.length === 0) {
      return this.openSnackBar(
        'Cannot Export an empty data, please check your data again.',
        'Got It!'
      );
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Order Reports');

    let buff = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    XLSX.writeFile(workbook, 'Order Reports ' + this.currentDate + '.xlsx');
    return this.openSnackBar(
      'Exporting to Spreadsheet, please wait.',
      'Got It!'
    );
  }

  resetTransactionsFilter() {
    this.filteredTransactions = undefined;
    this.getTransactions();
    this.transactionsFilterForm.reset();
    this.openSnackBar('All filters has been cleared.', 'Got It!');
  }

  resetOrdersFilter() {
    this.filteredOrders = undefined;
    this.getOrders();
    this.ordersFilterForm.reset();
    this.openSnackBar('All filters has been cleared.', 'Got It!');
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  saveInvoice(row: any) {
    let orders = this.orders.filter((order) => order.code === row.order_code);
    const dialogRef = this.dialog
      .open(SalesDialogComponent, {
        width: '550px',
        data: {
          title: '[Invoice] ' + row.order_code,
          datasets: {
            transaction: row,
            orders: orders,
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
            this.openSnackBar('Selected Invoice has been printed.', 'Got It!');
          }
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
