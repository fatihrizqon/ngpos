import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../interfaces/User';
import { AppService } from './app.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  token_exp!: any;
  user!: User;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private readonly TOKEN_NAME = 'authentication';
  baseURI = this.appService.getURI();
  helper = new JwtHelperService();

  get access_token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  constructor(private appService: AppService, private router: Router) {
    this._isLoggedIn$.next(!!this.access_token);
    this.user = this.getUser(this.access_token);

    if (this.access_token) {
      const expiration = JSON.parse(atob(this.access_token.split('.')[1])).exp;
      setTimeout(() => {
        this.logout();
      }, expiration);
    }
  }

  ngOnInit(): void {}

  public isLoggedIn() {
    return !this.helper.isTokenExpired(this.access_token);
  }

  public login(user: any) {
    return this.appService.login(user).pipe(
      tap((response: any) => {
        localStorage.setItem(this.TOKEN_NAME, response.access_token);
        this._isLoggedIn$.next(true);
        this.user = this.getUser(response.access_token);
      })
    );
  }

  public register(user: any) {
    return this.appService.register(user).pipe(tap((response: any) => {}));
  }

  private getUser(access_token: string): User {
    if (!access_token) {
      return this.user as User;
    }

    return JSON.parse(atob(access_token.split('.')[1])).data as User;
  }

  public userdata() {
    return (this.user = this.getUser(this.access_token) as User);
  }

  public logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem(this.TOKEN_NAME);
  }
}
