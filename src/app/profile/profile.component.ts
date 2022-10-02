import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../interfaces/User';
import { DialogComponent } from '../layouts/dialog/dialog.component';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: any;
  progress = false;
  hidePassword = true;
  hideRepassword = true;
  genders = ['male', 'female'];
  profileForm!: FormGroup;

  constructor(
    public appService: AppService,
    public authService: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
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
    this.getProfile();
    this.profileForm = this.formBuilder.group({
      name: [this.user?.name, Validators.required],
      username: [this.user?.username, Validators.required],
      gender: [this.user?.gender, Validators.required],
      email: [this.user?.email, Validators.required],
      password: [''],
      repassword: [''],
      phone: [this.user?.phone],
    });
  }

  getProfile() {
    this.appService.profile().subscribe(
      (response) => {
        this.user = response.data;
        this.profileForm.controls['name'].setValue(this.user?.name);
        this.profileForm.controls['username'].setValue(this.user?.username);
        this.profileForm.controls['gender'].setValue(this.user?.gender);
        this.profileForm.controls['email'].setValue(this.user?.email);
        this.profileForm.controls['password'].setValue(this.user?.password);
        this.profileForm.controls['repassword'].setValue(this.user?.repassword);
        this.profileForm.controls['phone'].setValue(this.user?.phone);
      },
      (err) => {
        console.log(err.error.message);
      }
    );
  }

  updateProfile() {
    this.progress = true;
    var user = this.profileForm.value;
    this.appService.updateProfile(user).subscribe(
      (response) => {
        this.openSnackBar(response.message, 'Got It!');
        this.progress = false;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
        this.progress = false;
      }
    );
  }

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
