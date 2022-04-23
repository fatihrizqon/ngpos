import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DialogComponent } from './layouts/dialog/dialog.component';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuthorized = this.authService.user.role > 0;
    if (!isAuthorized) {
      this.openDialog();
      this.router.navigate(['']);
    }

    return isAuthorized;
  }

  openDialog() {
    const dialogRef = this.dialog
      .open(DialogComponent, {
        width: '550px',
        data: {
          title: 'Caution',
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
