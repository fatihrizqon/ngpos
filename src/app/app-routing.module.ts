import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { DashboardIndexComponent } from './dashboard/index/dashboard.component';
import { SalesComponent } from './dashboard/sales/sales.component';
import { CategoryComponent } from './dashboard/category/category.component';
import { ProductComponent } from './dashboard/product/product.component';
import { SupplyComponent } from './dashboard/supply/supply.component';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { UsersComponent } from './dashboard/users/users.component';
import { CashierComponent } from './cashier/cashier.component';

const routes: Routes = [
  /* Primary Router Outlet */
  { path: '', component: IndexComponent },
  { path: 'cashier', component: CashierComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardIndexComponent,
        pathMatch: 'full',
      },
      {
        path: 'categories',
        component: CategoryComponent,
      },

      {
        path: 'products',
        component: ProductComponent,
      },

      {
        path: 'supply',
        component: SupplyComponent,
      },
      {
        path: 'sales',
        component: SalesComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
