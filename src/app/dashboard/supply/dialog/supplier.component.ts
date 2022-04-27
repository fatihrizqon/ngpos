import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'supplier-dialog',
  templateUrl: './supplier.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class SupplierDialogComponent implements OnInit {
  suppliers?: any;
  supplier?: any;
  dialogForm!: FormGroup;
  progress = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SupplierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
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
      name: [this.supplier?.name, Validators.required],
      address: [this.supplier?.address, Validators.required],
      email: [this.supplier?.email, Validators.required],
      contact: [this.supplier?.contact, Validators.required],
    });

    if (this.data.row != null) {
      this.dialogForm.controls['name'].setValue(this.data.row.name);
      this.dialogForm.controls['address'].setValue(this.data.row.address);
      this.dialogForm.controls['email'].setValue(this.data.row.email);
      this.dialogForm.controls['contact'].setValue(this.data.row.contact);
    }
  }

  submit(): void {
    this.progress = true;
    var supplier = this.dialogForm.value;
    if (this.data.action === 'create') {
      this.appService.newSupplier(supplier).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.appService.updateSupplier(supplier, this.data.row.id).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
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
