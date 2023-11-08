import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent {
  isMenuVisible: boolean = false;
  user: any = localStorage.getItem('AuthUsername');
  NotConnected = true;
  constructor(public router: Router, private route: ActivatedRoute) {
    this.router = router;
  }
  ngOnInit(): void {
    this.NotConnected = this.user === null;
  }
  ShowMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(["/login"])
  }
}
