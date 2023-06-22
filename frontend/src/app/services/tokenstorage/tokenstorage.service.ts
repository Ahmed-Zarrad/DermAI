import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenstorageService {
  hideWindow: EventEmitter<any> = new EventEmitter<any>();
  result: EventEmitter<any> = new EventEmitter<any>();
  constructor(private router: Router) {}

  public saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): any {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUsername(username: string) {
    window.localStorage.removeItem(USERNAME_KEY);
    window.localStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): any {
    return localStorage.getItem(USERNAME_KEY);
  }

  public saveAuthorities(authorities: string[]) {
    window.localStorage.removeItem(AUTHORITIES_KEY);
    window.localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }
  logOut() {
    localStorage.clear();
    this.router.navigate(["/login"])

  }
  setHideWindow(value:any) {
    this.hideWindow.emit(value);
  }
  setResult(value:any) {
    this.result.emit(value);
  }
}
