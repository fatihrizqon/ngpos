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
  selector: 'product-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  categories?: any;
  product?: any;
  dialogForm!: FormGroup;
  progress = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.appService.getCategories().subscribe(
      (response) => {
        this.categories = response.data;
      },
      (err) => {
        alert(err.error.message);
      }
    );

    this.dialogForm = this.formBuilder.group({
      name: [this.product?.name, Validators.required],
      purchase: [this.product?.purchase, Validators.required],
      sell: [this.product?.sell, Validators.required],
      category_id: [this.product?.category_id, Validators.required],
    });

    if (this.data.row != null) {
      this.dialogForm.controls['name'].setValue(this.data.row.name);
      this.dialogForm.controls['purchase'].setValue(this.data.row.purchase);
      this.dialogForm.controls['sell'].setValue(this.data.row.sell);
      this.dialogForm.controls['category_id'].setValue(
        this.data.row.category_id
      );
    }
  }

  submit(): void {
    this.progress = true;
    var product = this.dialogForm.value;

    if (this.data.action === 'create') {
      this.appService.newProduct(product).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          console.log(err.error.message);
        }
      );
    } else {
      this.appService.updateProduct(product, this.data.row.id).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          console.log(err.error.message);
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
