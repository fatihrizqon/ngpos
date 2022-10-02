import { DatePipe, formatDate } from '@angular/common';
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
import { AuthService } from 'src/app/services/auth.service';

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
  revenue: any;
  date: any;
  currentDate: any;

  @ViewChild('saleschart') saleschart: any;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public datePipe: DatePipe
  ) {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      this.openSnackBar(
        'Your login session has been expired, please re-login.',
        'Got It'
      );
    }

    this.currentDate = formatDate(
      new Date(),
      'dd/MM/yyyy HH:mm:ss',
      'en-US',
      '+0700'
    );
  }

  ngOnInit() {
    this.getTransactions();
  }

  ngAfterViewInit() {
    Chart.register(...registerables);
  }

  getTransactions() {
    this.appService.getTransactionsData().subscribe(
      (response) => {
        this.transactions = response.data;

        let chartData = Object.values(
          this.transactions.reduce((acc, { id, revenue, created_at }) => {
            const ds = created_at.substring(0, 10);
            acc[ds] = acc[ds] || { id, revenue: 0, created_at: ds };
            acc[ds] = {
              id: acc[ds].id,
              revenue: acc[ds].revenue + revenue,
              created_at: ds,
            };
            return acc;
          }, {})
        );

        chartData.sort(
          (a: any, b: any) =>
            Date.parse(a.created_at) - Date.parse(b.created_at)
        );

        chartData = chartData.slice(chartData.length - 14, chartData.length);
        this.revenue = chartData.map((transaction: any) => transaction.revenue);
        this.date = chartData.map((transaction: any) => transaction.created_at);

        this.canvas = this.saleschart.nativeElement;
        this.sctx = this.canvas.getContext('2d');

        new Chart(this.sctx, {
          type: 'line',
          data: {
            datasets: [
              {
                data: this.revenue,
                label: 'Sales',
                backgroundColor: '#FFA000',
                tension: 0.25,
                borderColor: '#FFA000',
                borderWidth: 1.5,
              },
            ],
            labels: this.date,
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
            data: this.revenue,
            label: 'Sales',
            backgroundColor: '#03A9F4',
            tension: 0.0,
            borderColor: '#F44336',
            borderWidth: 0.75,
          },
        ],
        labels: this.date,
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
