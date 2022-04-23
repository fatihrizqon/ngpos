import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogComponent } from '../layouts/dialog/dialog.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'root-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  openDialog() {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: '🚨 Caution 🚨',
          message: 'You are not authorized to visit this page.',
          action: 'caution',
          action_yes: 'Got It!',
          action_no: 'No',
        },
        disableClose: false,
      })
      .afterClosed();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
