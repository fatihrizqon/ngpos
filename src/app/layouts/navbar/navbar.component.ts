import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
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
