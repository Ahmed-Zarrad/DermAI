import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Status} from "../../models/status";
import {UserService} from "../../services/user/user.service";


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent {
  isMenuVisible: boolean = false;
  user: any = localStorage.getItem('AuthUsername');
  role: any = localStorage.getItem('AuthAuthorities');
  currentUserString = localStorage.getItem('CurrentUser');
  currentUser = this.currentUserString ? JSON.parse(this.currentUserString) : null;
  NotConnected = true;
  constructor(public router: Router, private route: ActivatedRoute, private userservice: UserService) {
    this.router = router;
  }
  ngOnInit(): void {
    this.NotConnected = this.user === null;
  }
  ShowMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
  logout() {
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
  }
}
