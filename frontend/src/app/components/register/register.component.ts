import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login/login.service";
// @ts-ignore
import {TokenstorageService} from "../../services/tokenstorage/tokenstorage.service";
import {Router} from "@angular/router";
import {Login} from "../../models/login.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  form: any = {};
  msg = '';
  constructor(private loginservice: LoginService,
              private tokenstorage: TokenstorageService,
              private router: Router) { }

  ngOnInit(): void {
  }

  authenticat() {

    this.loginservice.login(new Login(this.form.username, this.form.password)).subscribe(
      data => {
        this.tokenstorage.saveToken(data.token)
        localStorage.setItem('Type', data.type)
        this.tokenstorage.saveUsername(data.username)
        this.tokenstorage.saveAuthorities(data.authorities)

        this.router.navigate(["/test"])
      },
      error => {
        this.msg = 'Username Or password Invalid';
      }
    )
  }
}
