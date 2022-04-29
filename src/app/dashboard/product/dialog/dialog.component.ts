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
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'product-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  categories?: any;
  product?: any;
  products?: any;
  dialogForm!: FormGroup;
  progress = false;
  importedData!: string;
  baseURI = this.appService.baseURI;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.products = data.datasets?.products;
  }

  ngOnInit(): void {
    this.appService.getCategories().subscribe(
      (response) => {
        this.categories = response.data;
      },
      (err) => {
        console.log(err.error.message);
      }
    );

    this.dialogForm = this.formBuilder.group({
      name: [this.product?.name, Validators.required],
      code: [this.product?.code],
      purchase: [this.product?.purchase, Validators.required],
      sell: [this.product?.sell, Validators.required],
      category_id: [this.product?.category_id, Validators.required],
    });

    if (this.data.row != null) {
      this.dialogForm.controls['name'].setValue(this.data.row.name);
      this.dialogForm.controls['code'].setValue(this.data.row.code);
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
          this.openSnackBar(err.error.message, 'Got It!');
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
    var products = {
      products: this.importedData,
    };

    this.appService.importProducts(products).subscribe(
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

  print(): void {
    const options = {
      filename: 'Products Barcode Print.pdf',
      html2canvas: {},
      jsPDF: {
        unit: 'mm',
        orientation: 'portrait',
        format: 'A7',
      },
    };
    const content = window.document.getElementById('barcode');
    html2pdf().from(content).set(options).save();
    this.dialogRef.close();
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
