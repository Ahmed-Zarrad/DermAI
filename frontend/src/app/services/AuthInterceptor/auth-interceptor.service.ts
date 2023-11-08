import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

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
