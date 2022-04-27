import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'sales-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class SalesDialogComponent implements OnInit {
  dialogForm!: FormGroup;
  progress = false;
  transaction: any;
  orders: any;
  total_items!: any;
  total_quantity!: any;
  revenue!: any;

  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SalesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transaction = this.data.datasets.transaction;
    this.orders = this.data.datasets.orders;
  }

  ngOnInit(): void {}

  print(): void {
    const options = {
      filename: this.data.datasets.transaction.order_code + '.pdf',
      html2canvas: {},
      jsPDF: {
        unit: 'mm',
        orientation: 'portrait',
        format: 'A7',
      },
    };
    const content = window.document.getElementById('invoice');
    html2pdf().from(content).set(options).save();
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
