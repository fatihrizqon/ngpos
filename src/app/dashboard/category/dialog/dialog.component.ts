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
import * as XLSX from 'xlsx';

@Component({
  selector: 'category-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class CategoryDialogComponent implements OnInit {
  category?: any;
  dialogForm!: FormGroup;
  progress = false;
  importedData: any;
  baseURI = this.appService.baseURI;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.appService.getCategories().subscribe(
      (response) => {
        this.category = response.data;
      },
      (err) => {
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
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
          console.log(err.error.message);
          this.openSnackBar(err.error.message, 'Got It!');
        }
      );
    } else {
      this.appService.updateCategory(category, this.data.row.id).subscribe(
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

  read(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) => {
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, {
        type: 'binary',
      });
      workbook.SheetNames.forEach((sheet) => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        this.importedData = JSON.stringify(data, undefined);
      });
    };
  }

  import() {
    this.progress = true;
    if (this.importedData === undefined) {
      return this.openSnackBar('Unable to Import an Empty Data.', 'Got It!');
    }
    var categories = {
      product_categories: this.importedData,
    };
    this.appService.importCategories(categories).subscribe(
      (response) => {
        this.progress = false;
        this.openSnackBar('Importing Data, please wait.', 'Got It!');
        if (response.data) {
          this.openSnackBar(response.message, 'Got It!');
          this.progress = false;
          this.dialogRef.close();
        }
      },
      (err) => {
        this.progress = false;
        console.log(err.error.message);
        this.openSnackBar(err.error.message, 'Got It!');
      }
    );
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
