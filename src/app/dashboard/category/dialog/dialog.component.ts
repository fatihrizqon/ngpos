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
  selector: 'category-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class CategoryDialogComponent implements OnInit {
  category?: any;
  dialogForm!: FormGroup;
  progress = false;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.appService.getCategories().subscribe(
      (response) => {
        this.category = response.data;
      },
      (err) => {
        alert(err.error.message);
      }
    );

    this.dialogForm = this.formBuilder.group({
      name: [this.category?.name, Validators.required],
    });

    if (this.data.row != null) {
      this.dialogForm.controls['name'].setValue(this.data.row.name);
    }
  }

  submit(): void {
    this.progress = true;
    var category = this.dialogForm.value;
    if (this.data.action === 'create') {
      this.appService.newCategory(category).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          alert(err.error.message);
        }
      );
    } else {
      this.appService.updateCategory(category, this.data.row.id).subscribe(
        (response) => {
          this.dialogRef.close(response);
          this.progress = false;
        },
        (err) => {
          alert(err.error.message);
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
