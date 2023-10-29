import { Component, OnInit } from '@angular/core';
import {Chat} from "../../models/chat.model";
import {ChatbotService} from "../../services/chatbot/chatbot.service";
import { ActivatedRoute, Router } from '@angular/router';
import {Message} from "../../models/message.model";
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  isActionMenuVisible: boolean = false;
  isDoctorsVisible : boolean =false;
  isDermAIVisible : boolean= false;
  isChatActive : any;
  ListChats: Chat[]= [];
  ListMessages: Message[]= [];
  c: any = {};
  m: any = {};
  msg:any;
  initialRowHeight = 20;
  constructor(private route: ActivatedRoute, private chatbotService: ChatbotService, private router: Router, ) { }
  ngOnInit() {
  }
  ShowActionMenu() {
    this.isActionMenuVisible = !this.isActionMenuVisible;
  }
  ShowDoctorsContacts() {
    this.isDoctorsVisible = true;
    this.isDermAIVisible = false;
  }
  ShowDermAI() {
    this.isDermAIVisible = true;
    this.isDoctorsVisible = false;
    this.chatbotService.getAllChats().subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
  }
  createChat() {
    this.chatbotService.crateChat().subscribe(
      data => {
        console.log(data);
        this.msg = 'Chat Added Succefully !';
      },
      error => {
        console.log("exception occured");
        this.msg = 'error occured !';
      }
    );
    this.chatbotService.getAllChats().subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
  }
  deleteChat(idChat: any) {
    this.chatbotService.deleteChat(idChat).subscribe(
      data => {
        console.log(data);
        this.msg = 'Chat deleted succefully !';
      },
      // tslint:disable-next-line:no-shadowed-variable
      error =>
        console.log(error)
    );
    this.chatbotService.getAllChats().subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
  }
  activateChat(idChat: any){
    this.isChatActive= idChat;
    this.chatbotService.getAllMessages(idChat).subscribe(data => {
        this.ListMessages = data;
      },

      error => {
        console.log(error);
      });
  }
  autoResize(event: Event): void {
    const element = event.target as HTMLTextAreaElement;
    element.style.height = `${this.initialRowHeight}px`;
    element.style.height = `${element.scrollHeight}px`;
  }
}
