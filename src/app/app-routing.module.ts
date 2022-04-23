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
import { BalanceComponent } from './dashboard/balance/balance.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* Primary Router Outlet */
  { path: '', component: IndexComponent, canActivate: [AuthGuard] },
  {
    path: 'cashier',
    component: CashierComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 3,
    },
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
        data: {
          role: 6,
        },
      },
      {
        path: 'sales',
        component: SalesComponent,
      },
      {
        path: 'balance',

        component: BalanceComponent,
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
