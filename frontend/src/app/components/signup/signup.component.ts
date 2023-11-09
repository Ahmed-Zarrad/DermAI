import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  form: any = {};
  msg = '';
  output: any;
  role: any;
  constructor(private route: ActivatedRoute, private userservice: UserService, private router: Router, private user: User,private photo :  File) {
    this.photo = photo;
  }

  ngOnInit(): void {
  }
  addUser(role:any) {
    this.user = new User(this.form.username, this.form.password, this.form.confirmPassword, this.form.firstName,
      this.form.lastName, this.form.email, this.form.birthday, this.form.phone, this.form.country, this.form.city,
      this.form.address, this.form.postalCode, this.form.speciality, this.form.photo,
      this.form.publicId)
    if (this.photo.length > 0) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!allowedTypes.includes(this.photo.type)) {
        this.msg = 'Invalid image type (only png, jpg, jpeg are allowed).';
      } else if (this.photo.size > 3000000) {
        this.msg = 'Image size must be less than 1MB';
      }
      this.userservice.uploadPhoto(this.photo).subscribe(
        data => {
          console.log(data);
          this.output = data;
          this.form.photo = this.output.photo;
          this.form.publicId = this.output.publicId;
          this.userservice.addUser(this.user, role).subscribe(
            data => {
              console.log(data);
              this.msg = 'User Added Succefully !';
              this.form = " ";
            },
            error => {
              console.log(error);
              this.msg = 'Email or Username Alredy Exist !';
            }
          );
        },
        error => {
          console.log(error);
          this.msg = 'error';
        }
      )
    }
    else {
      this.userservice.addUser(this.user, role).subscribe(
        data => {
          console.log(data);
          this.msg = 'User Added Succefully !';
          this.form = " ";
        },
        error => {
          console.log(error);
          this.msg = 'Email or Username Alredy Exist !';
        }
      );
    }
  }

}

