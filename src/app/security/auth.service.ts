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

  private readonly JWT_TOKEN = 'access_token';
  private readonly REFRESH_TOKEN = 'refresh_token';
  private loggedUser!: string;

  constructor(private http: HttpClient) {}

  login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${config.apiSecurityUrl}/login`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));
  }

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

  refreshToken() {
    return this.http.post<any>(`${config.apiSecurityUrl}/refresh-token`, {
      //"grant_type": "refresh_token",
      "refreshToken": this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.access_token);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = '';
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
