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
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { CashflowComponent } from './dashboard/cashflow/cashflow.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* Primary Router Outlet */
  { path: '', component: IndexComponent, canActivate: [AuthGuard] },
  {
    path: 'cashier',
    component: CashierComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 1,
    },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 1,
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
        canActivate: [RoleGuard],
        data: {
          role: 1,
        },
      },

      {
        path: 'products',
        component: ProductComponent,
        canActivate: [RoleGuard],
        data: {
          role: 1,
        },
      },

      {
        path: 'supply',
        component: SupplyComponent,
        canActivate: [RoleGuard],
        data: {
          role: 2,
        },
      },
      {
        path: 'sales',
        component: SalesComponent,
        canActivate: [RoleGuard],
        data: {
          role: 1,
        },
      },
      {
        path: 'cashflow',
        component: CashflowComponent,
        canActivate: [RoleGuard],
        data: {
          role: 3,
        },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [RoleGuard],
        data: {
          role: 2,
        },
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuard],
        data: {
          role: 4,
        },
      },
    ],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
