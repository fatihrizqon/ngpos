import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../interfaces/User';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  token_exp!: any;
  user!: User;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private readonly TOKEN_NAME = 'authentication';

  get access_token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  constructor(private appService: AppService, private router: Router) {
    this._isLoggedIn$.next(!!this.access_token);
    this.user = this.getUser(this.access_token);
    // this.tokenExpired(this.access_token);
  }

  ngOnInit(): void {}

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
      return this.user as User;
    }

    return JSON.parse(atob(access_token.split('.')[1])).uid as User;
  }

  public logout() {
    return this.appService.logout().subscribe(
      (response) => {
        localStorage.removeItem(this.TOKEN_NAME);
        this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err.error.message);
      }
    );
  }
}
