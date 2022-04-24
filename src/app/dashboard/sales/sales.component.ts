import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/services/app.service';

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

  constructor(
    private appService: AppService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

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
      }
    );
  }

  transactionsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  ordersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ordersDataSource.filter = filterValue.trim().toLowerCase();
  }

  printTransaction(row: any) {
    alert('Print...');
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
