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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  spinner = false;
  hidePassword = true;
  hideRepassword = true;
  genders = ['male', 'female'];
  registerForm!: FormGroup;
  name = new FormControl();
  username = new FormControl();
  gender = new FormControl();
  email = new FormControl();
  password = new FormControl();
  repassword = new FormControl();
  phone = new FormControl();

  constructor(
    private router: Router,
    private appService: AppService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', [Validators.required]],
      phone: [''],
    });
  }

  register() {
    this.spinner = true;
    var user = this.registerForm.value;
    if (user.password !== user.repassword) {
      this.spinner = false;
      this.openSnackBar(
        'Password and Confirmation Password does not match.',
        'Got It!'
      );
    } else {
      this.authService.register(user).subscribe(
        (response) => {
          this.spinner = false;
          console.log(response);
        },
        (err) => {
          this.spinner = false;
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
