import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../interfaces/User';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  access_token!: any;
  token_exp!: any;
  user!: User;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private readonly TOKEN_NAME = 'authentication';

  // get access_token(): any {
  //   return localStorage.getItem(this.TOKEN_NAME);
  // }

  constructor(private appService: AppService, private router: Router) {
    this.access_token = localStorage.getItem(this.TOKEN_NAME);
    this._isLoggedIn$.next(!!this.access_token);
    this.user = this.getUser(this.access_token);
    // IMPORTANT: In production, access_token should be expired. Before do this, please check the expiration
  }

  baseURI = this.appService.getURI();

  public login(user: any) {
    return this.appService.login(user).pipe(
      tap((response: any) => {
        localStorage.setItem('authentication', response.access_token);
        this._isLoggedIn$.next(true);
        this.user = this.getUser(response.access_token);
      })
    );
  }

  public register(user: any) {
    return this.appService.register(user).pipe(
      tap((response: any) => {
        console.log(response);
      })
    );
  }

  private getUser(access_token: string): User {
    if (!access_token) {
      console.log('Token does not exists.');
      return this.user as User;
    }
    var data = JSON.parse(atob(access_token.split('.')[1]));

    this.token_exp = data.exp;
    this.user = data.uid;

    return this.user as User;
  }

  // public getRole() {
  //   return this.user.role;
  // }

  public isLoggedIn(): boolean {
    if (this.token_exp > Date.now() / 1000) {
      return true;
    }
    return false;
  }

  public logout() {
    this.access_token = '';
    window.localStorage.removeItem(this.TOKEN_NAME);
    this.router.navigateByUrl('/');
  }
}
