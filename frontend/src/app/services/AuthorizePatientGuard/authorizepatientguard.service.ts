import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthorizepatientguardService implements CanActivate {

  constructor(private router: Router) { }
  canActivate() {
    const authAuthorities = localStorage.getItem("AuthAuthorities");

    if (
      authAuthorities === null || // Check if authAuthorities is null
      (authAuthorities.includes("admin") || authAuthorities.includes("doctor"))
    ) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
