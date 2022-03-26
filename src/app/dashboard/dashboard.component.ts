import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  saleschart: any;
  cashchart: any;

  constructor() {}

  ngOnInit(): void {
    this.saleschart = document.getElementById('saleschart');
    this.cashchart = document.getElementById('cashchart');
    Chart.register(...registerables);
    this.loadSalesChart();
    this.loadCashFlowChart();
  }

  loadSalesChart() {
    new Chart(this.saleschart, {
      type: 'line',
      data: {
        datasets: [
          {
            data: [
              10, 72, 30, 24, 52, 24, 28, 29, 54, 76, 60, 90,
            ] /* Transaction Data */,
            label: 'Sales',
            backgroundColor: '#03A9F4',
            tension: 0.1,
            borderColor: '#F44336',
            borderWidth: 0.75,
          },
        ],
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
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

  loadCashFlowChart() {
    new Chart(this.cashchart, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Cash in',
            data: [
              80000, 75000, 60000, 40000, 55000, 70000, 28000, 29000, 54000,
              76000, 90000, 70000,
            ],
            backgroundColor: '#F44336',
            tension: 0.1,
            borderColor: '#03A9F4',
            borderWidth: 0.75,
          },
          {
            label: 'Cash out',
            data: [
              5000, 2500, 6000, 4000, 2000, 7000, 2000, 29000, 54000, 76000,
              60000, 90000,
            ],
            backgroundColor: '#03A9F4',
            tension: 0.1,
            borderColor: '#F44336',
            borderWidth: 0.75,
          },
        ],
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
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
}
