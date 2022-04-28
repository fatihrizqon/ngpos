import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { stringify } from 'querystring';
import { AppService } from 'src/app/services/app.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'supplier-dialog',
  templateUrl: './supplier.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class SupplierDialogComponent implements OnInit {
  suppliers?: any;
  supplier?: any;
  dialogForm!: FormGroup;
  importForm!: FormGroup;
  progress = false;
  files: any;
  importedData!: string;
  baseURI = this.appService.baseURI;

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
      return this.openSnackBar('Cannot Import an Empty File.', 'Got It!');
    }
    var suppliers = {
      suppliers: this.importedData,
    };
    this.appService.importSuppliers(suppliers).subscribe(
      (response) => {
        console.log(response);
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
