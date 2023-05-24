import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __values } from 'tslib';
import { LoginService } from '../../services/login/login.service'
import { TokenstorageService } from '../../services/tokenStorage/tokenstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private token: LoginService, private tokens: TokenstorageService) { }

  // tslint:disable-next-line:typedef
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = localStorage.getItem('AuthToken');
    if (token != null) {
      authReq = req.clone({
        headers: req.headers.set(
          'Authorization', 'Bearer ' + token)
      });
    }
    return next.handle(authReq);
  }
}
