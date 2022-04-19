import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'supply-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class SupplyDialogComponent implements OnInit {
  products?: any;
  suppliers?: any;
  supply?: any;
  dialogForm!: FormGroup;
  progress = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SupplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.appService.getProducts().subscribe(
      (response) => {
        this.products = response.data;
      },
      (err) => {
        if (err.error.message) {
          console.log(err.error.message);
        }
      }
    );

    this.appService.getSuppliers().subscribe(
      (response) => {
        this.suppliers = response.data;
      },
      (err) => {
        if (err.error.message) {
          console.log(err.error.message);
        }
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
    if (this.data.action === 'create') {
      this.appService.newSupply(supply).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.appService.updateSupply(supply, this.data.row.id).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
