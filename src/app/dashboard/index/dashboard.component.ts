import { DatePipe } from '@angular/common';
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
        this.revenue = this.transactions.map(
          (transaction: any) => transaction.revenue
        );

        this.date = this.transactions.map((transaction: any) =>
          this.datePipe.transform(transaction.created_at, 'dd/MM/yy')
        );

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
                tension: 0.25,
                borderColor: '#F44336',
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
