import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/User';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'user-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  user: User;
  roles = [0, 1, 2, 3, 4, 5];
  dialogForm!: FormGroup;
  progress = false;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = this.authService.userdata();
  }

  ngOnInit(): void {
    console.log(this.user.role);
    console.log(this.data.row.role);

    this.appService.getCategories().subscribe(
      (response) => {
        this.user = response.data;
      },
      (err) => {
        console.log(err.error.message);
      }
    );

    this.dialogForm = this.formBuilder.group({
      role: [this.user?.role, Validators.required],
    });

    if (this.data.row != null) {
      this.dialogForm.controls['role'].setValue(this.data.row.role);
    }
  }

  submit(): void {
    this.progress = true;
    var user = this.dialogForm.value;
    this.appService.updateUser(user, this.data.row.id).subscribe(
      (response) => {
        this.dialogRef.close(response);
        this.progress = false;
      },
      (err) => {
        console.log(err.error.message);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
