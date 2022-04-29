import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/interfaces/User';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'cashflow-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class CashflowDialogComponent implements OnInit {
  user!: User;
  cashflow?: any;
  dialogForm!: FormGroup;
  progress = false;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CashflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = this.authService.userdata();
  }

  ngOnInit(): void {
    this.appService.getCategories().subscribe(
      (response) => {
        this.cashflow = response.data;
      },
      (err) => {
        alert(err.error.message);
      }
    );

    this.dialogForm = this.formBuilder.group({
      operation: [this.cashflow?.operation, Validators.required],
      debit: [this.cashflow?.debit, Validators.required],
      credit: [this.cashflow?.credit, Validators.required],
      notes: [this.cashflow?.notes, Validators.required],
    });

    if (this.data.row != null) {
      this.dialogForm.controls['operation'].setValue(this.data.row.operation);
      this.dialogForm.controls['debit'].setValue(this.data.row.debit);
      this.dialogForm.controls['credit'].setValue(this.data.row.credit);
      this.dialogForm.controls['notes'].setValue(this.data.row.notes);
    }
  }

  submit(): void {
    this.progress = true;
    var cashflow = this.dialogForm.value;
    cashflow.user_id = this.user.id;
    if (
      this.dialogForm.controls['debit'].value === 0 &&
      this.dialogForm.controls['credit'].value === 0
    ) {
      return this.openSnackBar('Debit or Credit cannot be 0', 'Got It!');
    }

    if (this.data.action === 'create') {
      this.appService.newCashflow(cashflow).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = true;
        },
        (err) => {
          this.progress = false;
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
    } else {
      this.appService.updateCashflow(cashflow, this.data.row.id).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          this.progress = false;
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
    }
  }

  debitChange() {
    return this.dialogForm.controls['credit'].setValue(0);
  }

  creditChange() {
    return this.dialogForm.controls['debit'].setValue(0);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
