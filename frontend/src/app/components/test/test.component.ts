import { Component, OnInit } from '@angular/core';
import {Chat} from "../../models/chat.model";
import {ChatbotService} from "../../services/chatbot/chatbot.service";
import { ActivatedRoute} from '@angular/router';
import {Message} from "../../models/message.model";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  isActionMenuVisible: boolean = false;
  isDoctorsVisible : boolean =false;
  isDermAIVisible : boolean= false;
  showData : boolean= false;
  isChatActive : any;
  ListChats: Chat[]= [];
  ListMessages: Message[]= [];
  ListDoctors: User[]= [];
  u: any = {};
  c: any = {};
  m: any = {};
  msg:any = "test";
  initialRowHeight = 20;
  resp: any = null;
  userInput: any;
  loading = false;
  idChat:any;
  result: any;
  constructor(private route: ActivatedRoute, private chatbotService: ChatbotService, private userService: UserService) { }
  ngOnInit() {
  }
  ShowActionMenu() {
    this.isActionMenuVisible = !this.isActionMenuVisible;
  }
  ShowDoctorsContacts() {
    this.isDoctorsVisible = true;
    this.isDermAIVisible = false;
    const type = "UserChat";
    const role = "doctor";
    this.chatbotService.getAllChats(type).subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
    this.userService.getByRoleUser(role).subscribe(data => {
      this.ListDoctors = data;
    },
      error => {
      console.log(error);
      });
  }
  ShowDermAI() {
    this.isDermAIVisible = true;
    this.isDoctorsVisible = false;
    const type = "ChatbotChat";
    this.chatbotService.getAllChats(type).subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
  }
  createChatbotChat() {
    this.chatbotService.crateChatbotChat().subscribe(
      data => {
      },
      error => {
        console.log(error);
        this.msg = 'error occured !';
      }
    );
    this.chatbotService.getAllChats('ChatbotChat').subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
  }
  deleteChat(idChat: any, type: any) {
    this.chatbotService.deleteChat(idChat).subscribe(
      data => {
        console.log(data);
        this.msg = 'Chat deleted succefully !';
      },
      // tslint:disable-next-line:no-shadowed-variable
      error =>
        console.log(error)
    );
    this.chatbotService.getAllChats(type).subscribe(data => {
        this.ListChats = data;
      },

      error => {
        console.log(error);
      });
  }
  activateChat(idChat: any){
    this.isChatActive= idChat;
    this.chatbotService.getAllMessages(idChat).subscribe(data => {
        console.log(data);
        this.ListMessages = data;
        this.idChat = idChat;
      },

      error => {
        console.log(error);
      });
  }
  sendMessageToChatbot(): void {
    const idChat = this.isChatActive;
    const message = this.userInput.trim();
    if (message.length === 0) return;
    this.loading = true;
    this.userInput = '';
    this.chatbotService.chatbot(message, 'user', idChat).subscribe(
      data => {
        this.resp= data
        this.loading = false;
        console.log(data);
        this.chatbotService.getAllMessages(this.idChat).subscribe(data => {
            console.log(data);
            this.ListMessages = data;
          },

          error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
        this.msg = 'error';
      }
    );
    this.chatbotService.getAllMessages(this.idChat).subscribe(data => {
        console.log(data);
        this.ListMessages = data;
      },

      error => {
        console.log(error);
      });
  }
  sendBotMessage(message:any): void {
    if (message.length === 0) return;
    this.loading = true;
    const idChat = ""
    this.chatbotService.chatbot(message, 'assistant', idChat).subscribe(
      data => {
        this.resp= data
        this.loading = false;
        console.log(data);
        this.chatbotService.getAllMessages(this.idChat).subscribe(data => {
            console.log(data);
            this.ListMessages = data;
          },

          error => {
            console.log(error);
          });
      },
      error => {
        console.log(error);
        this.msg = 'error';
      }
    );
    this.chatbotService.getAllMessages(this.idChat).subscribe(data => {
        console.log(data);
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
  // handleImageUpload(event: any):void {
  //   this.loading = true;
  //   if (event.target.files.length > 0) {
  //     const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  //
  //     if (!allowedTypes.includes(event.target.files[0].type)) {
  //       this.loading = false;
  //       this.displayBotMessage1(this.msg= 'Invalid image type (only png, jpg, jpeg are allowed).');
  //     }
  //
  //     else if (event.target.files[0].size > 3000000) {
  //       this.loading = false;
  //       this.displayBotMessage1(this.msg = 'Image size must be less than 1MB');
  //     }
  //
  //     const skinImage: File = event.target.files[0];
  //     this.skinResultsService.uploadSkinImage(skinImage).subscribe(
  //       data => {
  //         console.log(data);
  //         this.result = data;
  //         this.loading = false;
  //         this.showData = false;
  //         this.chatbotService.chatbot("the result of processing the user skin image is Skin type: "+this.result.skinType+"Probability: "+this.result.probability+"% ask me 5 yes or no question to verify if he really have this skin type or this skin pathology and Do not ask all the questions at once, send each question separately and after I reply with yes or no ask me the next question until the user answer all the questions after I answer all the question tell me the result of the quiz", 'system').subscribe(
  //           data => {
  //             this.resp= data
  //             console.log(data);
  //
  //           },
  //           error => {
  //             console.log(error);
  //             this.msg = 'error';
  //           }
  //         )
  //       },
  //       error => {
  //         console.log(error);
  //         this.err= error;
  //         this.loading = false;
  //         if (this.err.status===401) {
  //           this.displayBotMessage1(this.msg = 'Token expired. You must login to continue');
  //           setTimeout(() => {
  //             this.tokenstorageService.logOut();}, 4000);
  //         }
  //         else if (this.err.status === 500) {
  //
  //           this.displayBotMessage1(this.msg = 'Failed to connect to the server.');
  //         }
  //
  //         else {
  //           this.displayBotMessage1(this.msg = 'Invalid image.');
  //         }
  //       });
  //   }
  // }
  alertmsg():void{
    console.log(this.msg);
  }
}
