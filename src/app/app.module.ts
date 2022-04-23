import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { CashierComponent } from './cashier/cashier.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DialogComponent } from './layouts/dialog/dialog.component';

import { DashboardIndexComponent } from './dashboard/index/dashboard.component';
import { CategoryComponent } from './dashboard/category/category.component';
import { CategoryDialogComponent } from './dashboard/category/dialog/dialog.component';
import { ProductComponent } from './dashboard/product/product.component';
import { ProductDialogComponent } from './dashboard/product/dialog/dialog.component';
import { SupplyComponent } from './dashboard/supply/supply.component';
import { SupplyDialogComponent } from './dashboard/supply/dialog/supply.component';
import { SupplierDialogComponent } from './dashboard/supply/dialog/supplier.component';
import { SalesComponent } from './dashboard/sales/sales.component';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { UsersComponent } from './dashboard/users/users.component';

import { AppService } from './services/app.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { BalanceComponent } from './dashboard/balance/balance.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    CashierComponent,
    DashboardComponent,
    DashboardIndexComponent,
    CategoryComponent,
    ProductComponent,
    SalesComponent,
    SupplyComponent,
    ReportsComponent,
    UsersComponent,
    DialogComponent,
    CategoryDialogComponent,
    ProductDialogComponent,
    SupplyDialogComponent,
    SupplierDialogComponent,
    NavbarComponent,
    BalanceComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    QRCodeModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [AppService, AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [DialogComponent],
})
export class AppModule {}
