// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { LoginService } from '../login/login.service';
// import { TokenstorageService } from '../TokenStorage/tokenstorage.service';
// import { UserService } from '../user/user.service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthorizeGuardService implements CanActivate{
//
//   constructor(private loginservice: LoginService,
//     private router: Router) { }
//
//   canActivate() {
//     if (localStorage.getItem("AuthAuthorities").includes(null)) {
//       this.router.navigate(['/login']);
//       return false;
//     }
//     return true;
//   }
//
// }
