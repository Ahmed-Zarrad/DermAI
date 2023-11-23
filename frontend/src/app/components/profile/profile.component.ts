import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {UserService} from "../../services/user/user.service";
import {ActivatedRoute} from "@angular/router";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUserString = localStorage.getItem('CurrentUser');
  currentUser = this.currentUserString ? JSON.parse(this.currentUserString) : null;
  constructor(private route: ActivatedRoute, private userService: UserService) { }
  ngOnInit() {

  }

}
