import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  spinner = false;
  hide = true;
  loginForm!: FormGroup;
  username = new FormControl();
  password = new FormControl();

  constructor(
    private router: Router,
    private appService: AppService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    // if (this.authService.isLoggedIn()) {
    //   this.openSnackBar('You are logged in.', 'Got It!');
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.spinner = true;
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        this.spinner = false;
        this.openSnackBar(response.message, 'Got It!');
        this.router.navigate(['/']);
      },
      (err) => {
        this.spinner = false;
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
