import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {UserService} from "../user/user.service";
import {Status} from "../../models/status";

@Injectable({
  providedIn: 'root'
})
export class AuthorizecombinedguardService implements CanActivate {

  constructor(private router: Router, private userservice: UserService,) { }

  canActivate() {
    const authAuthorities = localStorage.getItem("AuthAuthorities");
    if (authAuthorities != null) {
      return true;
    }
    this.userservice.updateStaus(Status.offline).subscribe(
      data => {
        console.log(data);
        localStorage.clear();
        this.router.navigate(["/login"]);
      },
      error => {
        console.log(error);
      }
    );
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    return false;
  }
}
