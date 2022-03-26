import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './dashboard/category/category.component';
import { ProductComponent } from './dashboard/product/product.component';
import { PurchasesComponent } from './dashboard/purchases/purchases.component';
import { SalesComponent } from './dashboard/sales/sales.component';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { UsersComponent } from './dashboard/users/users.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/categories', component: CategoryComponent },
  { path: 'dashboard/products', component: ProductComponent },
  { path: 'dashboard/purchases', component: PurchasesComponent },
  { path: 'dashboard/sales', component: SalesComponent },
  { path: 'dashboard/reports', component: ReportsComponent },
  { path: 'dashboard/users', component: UsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
