import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthorizepatientguardService implements CanActivate {

  constructor(private router: Router) { }
  canActivate() {
    const authAuthorities = localStorage.getItem("AuthAuthorities");
    if (authAuthorities === "patient") {
      return true;
    }
    localStorage.clear();
    this.router.navigate(["/login"]);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
      return false;

  }
}
