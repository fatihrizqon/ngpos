import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layouts/layout.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { CashierComponent } from './cashier/cashier.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { CategoryComponent } from './dashboard/category/category.component';
import { ProductComponent } from './dashboard/product/product.component';
import { PurchasesComponent } from './dashboard/purchases/purchases.component';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { UsersComponent } from './dashboard/users/users.component';

import { AppService } from './services/app.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { DashboardIndexComponent } from './dashboard/index/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './layouts/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    CashierComponent,
    DashboardComponent,
    DashboardIndexComponent,
    CategoryComponent,
    ProductComponent,
    PurchasesComponent,
    ReportsComponent,
    UsersComponent,
    DialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    QRCodeModule,
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [DialogComponent],
})
export class AppModule {}
