import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {Status} from "../../models/status";
import {UserService} from "../../services/user/user.service";
import {Notification} from "../../models/notification.model";
import {NotificationService} from "../../services/notification/notification.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private readonly refreshInterval = 1000;
  isMenuVisible: boolean = false;
  isNotifMenuVisible: boolean = false;
  user: any = localStorage.getItem('AuthUsername');
  role: any = localStorage.getItem('AuthAuthorities');
  currentUserString = localStorage.getItem('CurrentUser');
  currentUser = this.currentUserString ? JSON.parse(this.currentUserString) : null;
  NotConnected = true;
  ListNotifications: Notification[]= [];
  ListUnread: any= [];
  notificationCount:number=0;
  n: any = {};
  constructor(public router: Router, private route: ActivatedRoute, private userservice: UserService, private notificationService: NotificationService) {
    this.router = router;
  }
  ngOnInit(): void {
    this.NotConnected = this.user === null;

      this.subscription = interval(this.refreshInterval).subscribe(() => {
        this.notificationService.getAllnotifications().subscribe(
          (data) => {
            this.ListNotifications = data;
            this.ListUnread = this.ListNotifications.map((chat) => chat.unread);
            this.notificationCount = this.ListUnread.length;
          },
          (error) => {
            console.log(error);
          }
        );
      });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ShowMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
  ShowNotifMenu() {
    this.isNotifMenuVisible = !this.isNotifMenuVisible;
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
