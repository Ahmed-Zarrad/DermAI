import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../models/login.model';
import { LoginService } from '../../services/login/login.service';
import { TokenstorageService } from '../../services/tokenstorage/tokenstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
        this.tokenstorage.saveToken(data.token);
        localStorage.setItem('Type', data.type);
        this.tokenstorage.saveUsername(data.username);
        this.tokenstorage.saveAuthorities(data.authorities);
        this.tokenstorage.saveCurrentUser(data.currentUser);
        console.log(data);
        this.router.navigate(["/"]);
        window.location.reload();
      },
      error => {
        this.msg = 'Username Or password Invalid';
      }
    );
  }
}
