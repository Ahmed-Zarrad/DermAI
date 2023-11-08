import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeforgotguardServiceService implements CanActivate {

  constructor(private router: Router) { }
  canActivate() {
    const authAuthorities = localStorage.getItem("AuthAuthorities");

    if ( authAuthorities === null ) {
      return true;
    }
       this.router.navigate(['/login']);
       return false;
     }

}
