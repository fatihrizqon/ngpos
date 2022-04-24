import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  OnChanges,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart, registerables } from 'chart.js';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-dashboardindex',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardIndexComponent implements OnInit, AfterViewInit {
  isRefresh = true;
  canvas: any;
  sctx: any;
  transactions: any;
  total_price = [];
  date = [];

  dummydata: any;

  @ViewChild('saleschart') saleschart: any;

  constructor(private appService: AppService, private _snackBar: MatSnackBar) {}
  // Data not laoded properly
  ngOnInit() {
    this.getTransactions();
  }

  ngAfterViewInit() {
    Chart.register(...registerables);
    this.loadSalesChart();
  }

  getTransactions() {
    this.appService.getTransactions().subscribe(
      (response) => {
        this.transactions = response.data;
        this.total_price = this.transactions.map((price: any) => price.id);
        this.date = this.transactions.map((date: any) => date.created_at);
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  loadSalesChart() {
    this.canvas = this.saleschart.nativeElement;
    this.sctx = this.canvas.getContext('2d');
    new Chart(this.sctx, {
      type: 'line',
      data: {
        datasets: [
          {
            data: this.dummydata /* Transaction Data */,
            label: 'Sales',
            backgroundColor: '#03A9F4',
            tension: 0.0,
            borderColor: '#F44336',
            borderWidth: 0.75,
          },
        ],
        labels: this.dummydata,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            grid: {
              borderDash: [1, 2],
              drawBorder: false,
            },
            beginAtZero: true,
          },
          x: {
            grid: {
              drawBorder: false,
            },
          },
        },
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
