import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { Login } from '../../models/login.model';
import { JwtResponse } from '../../models/jwt-response.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  private  authenticateURL = 'http://localhost:3001/api/v1/login/';


  constructor(private authhttp: HttpClient, private router: Router) {
    //this.user = new User();
    this.currentUserSubject = new BehaviorSubject<any>(sessionStorage.getItem(TOKEN_KEY));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(login: Login) {
    return this.authhttp.post<JwtResponse>(this.authenticateURL, login, httpOptions)

      .pipe((data => {


        this.login;
        return data;
      }));
  }
  logout() {
    localStorage.clear();
    this.router.navigate(["/login"])
  }
}
