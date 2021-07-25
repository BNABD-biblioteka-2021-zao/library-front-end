import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { config } from '../config';
import { Tokens } from '../models/tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'accessToken';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private loggedUser!: string;

  constructor(private http: HttpClient) {}

  login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${config.apiSecurityUrl}/login`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          console.log('catch');
          alert(error.error);
          return of(false);
        }));
  }

  // tslint:disable-next-line:typedef
  logout() {
    // !nie działa /logout  ??
    // return this.http.post<any>(`${config.apiSecurityUrl}/logout`, {
    //   'refresh_token': this.getRefreshToken()
    // }).pipe(
    //   tap(() => this.doLogoutUser()),
    //   mapTo(true),
    //   catchError(error => {
    //     alert(error.error);
    //     return of(false);
    //   }));

    // * rozwiązanie tymczasowe:  [czyli stałe]
    this.doLogoutUser();
  }

  isLoggedIn():boolean {
    // this.http.get<string>(config.apiSecurityUrl + '/testA')
    // .subscribe(response => {
    //   console.log("ODP: " + response);
    //   if(response.match("test auth")){
    //     console.log("LoggedIn true");
    //     return true;
    //   }
    //   else{
    //     console.log("LoggedIn false");
    //     return false;
    //   }
    // })
    // console.log("LoggedIn false");
    // return false;

    return !!this.getJwtToken();
  }


  // tslint:disable-next-line:typedef
  refreshToken() {
    return this.http.post<any>(`${config.apiSecurityUrl }/refresh-token`, {
      'grant_type' : 'refreshToken',
      'refreshToken' : this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.accessToken);
    }));
  }


  // tslint:disable-next-line:typedef
  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  // tslint:disable-next-line:typedef
  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  // tslint:disable-next-line:typedef
  private doLogoutUser() {
    this.loggedUser = '';
    this.removeTokens();
  }

  // tslint:disable-next-line:typedef
  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  // tslint:disable-next-line:typedef
  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  // tslint:disable-next-line:typedef
  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  // tslint:disable-next-line:typedef
  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
