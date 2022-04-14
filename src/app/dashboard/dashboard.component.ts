import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'root-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isOpen = false;
  active = false;

  constructor() {}

  ngOnInit(): void {}

  toggle(event: any) {
    this.isOpen = !this.isOpen;
  }

  changeMode() {
    alert('Change to Dark/Light Mode');
  }

  toggleActive() {
    console.log('Toggle Active');
    this.active = !this.active;
  }
}
