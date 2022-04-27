import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/interfaces/User';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'supply-dialog',
  templateUrl: './supply.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class SupplyDialogComponent implements OnInit {
  user!: User;
  products?: any;
  suppliers?: any;
  supply?: any;
  dialogForm!: FormGroup;
  progress = false;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SupplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = this.authService.userdata();
  }

  ngOnInit(): void {
    this.appService.getProducts().subscribe(
      (response) => {
        this.products = response.data;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );

    this.appService.getSuppliers().subscribe(
      (response) => {
        this.suppliers = response.data;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );

    this.dialogForm = this.formBuilder.group({
      product_id: [this.supply?.product_id, Validators.required],
      quantity: [this.supply?.quantity, Validators.required],
      supplier_id: [this.supply?.supplier_id, Validators.required],
    });

    if (this.data.row != null) {
      this.dialogForm.controls['product_id'].setValue(this.data.row.product_id);
      this.dialogForm.controls['quantity'].setValue(this.data.row.quantity);
      this.dialogForm.controls['supplier_id'].setValue(
        this.data.row.supplier_id
      );
    }
  }

  submit(): void {
    this.progress = true;
    var supply = this.dialogForm.value;
    supply.user_id = this.user.id;

    if (this.dialogForm.controls['quantity'].value === 0) {
      this.progress = false;
      return this.openSnackBar('Quantity cannot be 0', 'Got It!');
    }

    if (this.data.action === 'create') {
      this.appService.newSupply(supply).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          console.log(err.error.message);
          this.progress = false;
        }
      );
    } else {
      this.appService.updateSupply(supply, this.data.row.id).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
          this.progress = false;
        }
      );
    }
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
