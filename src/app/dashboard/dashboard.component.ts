import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'root-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isOpen = false;
  active = false;
  lightMode = true;

  constructor() {}

  ngOnInit(): void {}

  toggle(event: any) {
    this.isOpen = !this.isOpen;
  }

  changeMode(event: MatSlideToggleChange): void {
    document.body.classList.toggle('darkMode');
  }
}
