
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../../models/role';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user/user.service'
import {Speciality} from "../../models/speciality";
import {Status} from "../../models/status";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  ShowAllUsers: boolean = false;
  UpdateUser: boolean = false;
  DeleteUser: boolean = false;
  AddUsers: boolean = false;
  ShowUser: boolean = false;

  nameUser?: string;
  speciality = Speciality;
  Keyss(): Array<string> {
    var Keys = Object.keys(this.speciality);
    return Keys;
  }
  status = Status;
  Keysst(): Array<string> {
    var Keys = Object.keys(this.status);
    return Keys;
  }
  roleType = Role;
  Keysr(): Array<string> {
    var Keys = Object.keys(this.roleType);
    return Keys;
  }





  user?: User;
  usere?: User;
  userf?: User[] = [];
  ListUsers?: User[] = [];
  msg = '';
  form: any = {};
  forme: any = {};
  u: any = {};
  uu?: Observable<User[]>;
  id: any;
  hideall?: boolean;
  hidesearch: boolean = true;
  idUser: any;
  username?: any;
  us?: User;

  constructor(private route: ActivatedRoute, private userservice: UserService, private router: Router) { }

  ngOnInit(): void {

  }
  addUser() {
    this.AddUsers = true;
    this.ShowAllUsers = false;
    this.ShowUser = false;
    this.user = new User(this.form.id, this.form.username, this.form.password, this.form.confirmPassword, this.form.firstName, this.form.lastName, this.form.email, this.form.birthday, this.form.phone, this.form.country, this.form.city, this.form.address, this.form.postalCode, this.form.photo, this.form.publicId, this.form.chats)
    let photo = this.user.photo ?? '';
    var startIndex =
      this.user.photo!.indexOf('\\') >= 0
        ? photo.lastIndexOf('\\')
        : photo.lastIndexOf('/');
    photo = photo.substring(startIndex);
    if (photo.indexOf('\\') === 0 || photo.indexOf('/') === 0) {
      photo = photo.substring(1);
    }
    this.user.photo = photo;

    this.userservice.ajouterUser(this.user).subscribe(
      data => {
        this.msg = 'User Adeded Succesfuly';
        this.form = " ";
      },
      (error) => {
        console.log("exception occured");
        this.msg = 'Email or Username Alredy Exist !';
      }
    )
  }
  updateUser() {
    this.UpdateUser = true;
    this.AddUsers = false;
    this.DeleteUser = false;
    this.ShowAllUsers = false;
    this.ShowUser = true;
    this.us = new User (this.forme.id, this.forme.username, this.forme.password, this.forme.confirmPassword, this.forme.firstName, this.forme.lastName, this.forme.email, this.forme.birthday, this.forme.phone, this.forme.country, this.forme.city, this.forme.address, this.forme.postalCode, this.forme.photo, this.forme.publicId, this.forme.chats);
    var startIndex =
      this.us.photo!.indexOf('\\') >= 0
        ? this.us.photo!.lastIndexOf('\\')
        : this.us.photo!.lastIndexOf('/');
    var photo = this.us.photo!.substring(startIndex);
    if (photo.indexOf('\\') === 0 || photo.indexOf('/') === 0) {
      photo = photo.substring(1);
    }
    this.us.photo = photo;
    this.userservice.updateUser(this.us).subscribe(
      data => {
        console.log(data),
          this.msg = 'User Updated Succesfuly';
      },
      (error) => {
        console.log(error);
        this.msg = 'error';
      });
  }

  deleteUser(id: any) {
    this.DeleteUser = false;
    this.UpdateUser = false;
    this.AddUsers = false;
    this.ShowAllUsers = true;
    this.ShowUser = false;
    this.userservice.deleteUser(id).subscribe(
      data => {
        this.showAllUsers();
      },
      error =>
        console.log(error)
    );
  }
  showAllUsers() {
    this.ShowAllUsers = true;
    this.UpdateUser = false;
    this.AddUsers = false;
    this.DeleteUser = false;
    this.ShowUser = false;
    this.userservice.getAllUser().subscribe(data => {
      this.ListUsers = data;
    },
      error => {
        console.log(error);
    });
  }

  showUser(u: User) {
    this.DeleteUser = false;
    this.UpdateUser = false;
    this.AddUsers = false;
    this.ShowAllUsers = false;
    this.ShowUser = true;
    this.user = u;
  }

  getUserByName(nu: any) {
    this.hideall = true;
    this.hidesearch = false;
    this.userservice.getByUsernameUser(nu).subscribe(data => {
      this.user = data;
    })
  }


  Search() {
    if (this.username != "") {


      this.ListUsers = this.ListUsers?.filter(res => {
        return res.username.toLocaleLowerCase().match(this.username.toLocaleLowerCase());
      });
    }
    else if (this.username == "") {
      this.showAllUsers();
    }

  }
}
