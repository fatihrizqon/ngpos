import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  transactions: any;
  orders: any;
  displayedTransactions: string[] = [
    'id',
    'order_code',
    'total_price',
    'pay',
    'return',
    'user_id',
    'created_at',
    'updated_at',
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactionsDataSource.filter = filterValue.trim().toLowerCase();
    this.ordersDataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
