import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user.model";
import {SkinResultsService} from "../../services/skin-results/skin-results.service";
import {SkinResults} from "../../models/skin-results.model";
import {ChatbotService} from "../../services/chatbot/chatbot.service";
import {Chat} from "../../models/chat.model";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  ListDoctors: User[]= [];
  ListUserChats: Chat[]= [];
  ListChatbotChats: Chat[]= [];
  ListResults: SkinResults[]= [];
  ListUsersId: any= [];
  u: any = {};
  c: any = {};
  sr: any = {};
  currentUserString = localStorage.getItem('CurrentUser');
  currentUser = this.currentUserString ? JSON.parse(this.currentUserString) : null;
  constructor(private route: ActivatedRoute, private chatbotService: ChatbotService, private userService: UserService, private skinResultsService: SkinResultsService, private router: Router) { }
  ngOnInit() {
    this.userService.getByRoleUser('doctor').subscribe(data => {
        this.ListDoctors = data.filter((doctor: { id: string })=> doctor.id !== this.currentUser.id);
        this.chatbotService.getAllChats('UserChat').subscribe(data => {
            this.ListUserChats = data;
            this.ListUserChats.forEach(chat => {
              chat.users.forEach(id => {
                this.ListUsersId.push(id);
              });
            });
          },
          error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
      });
    this.chatbotService.getAllChats('ChatbotChat').subscribe(data => {
        this.ListChatbotChats = data;
        this.ListChatbotChats.forEach(chat => {
          chat.skinResults.forEach(id => {
            this.skinResultsService.getResultById(id).subscribe(
              data =>{
                this.ListResults.push(data);
              },
              error => {
                console.log(error);
              });
          });
        });
      },
      error => {
        console.log(error);
      });
  }

}
