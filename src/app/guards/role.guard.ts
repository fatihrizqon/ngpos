import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DialogComponent } from '../layouts/dialog/dialog.component';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private dialog: MatDialog) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuthorized = this.authService.user.role >= route.data.role;

    if (!isAuthorized) {
      this.openDialog();
      return false;
    }
    return true;
  }

  openDialog() {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: '🚨 Caution 🚨',
          message: 'You are not authorized to visit this page.',
          action: 'caution',
          action_yes: 'Got It!',
          action_no: 'No',
        },
        disableClose: false,
      })
      .afterClosed();
  }
}
