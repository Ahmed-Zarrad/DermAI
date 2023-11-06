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
  resp: any = null;
  userInput: any;
  loading = false;
  idChat:any;
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
        console.log(data);
        this.ListMessages = data;
        this.idChat = idChat;
      },

      error => {
        console.log(error);
      });
  }
  sendUserMessage(): void {
    const message = this.userInput.trim();
    if (message.length === 0) return;
    this.loading = true;
    this.userInput = '';
    this.chatbotService.chatbot(message, 'user').subscribe(
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
    this.chatbotService.chatbot(message, 'assistant').subscribe(
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
  handleImageUpload(event: any):void {
    this.loading = true;
    if (event.target.files.length > 0) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!allowedTypes.includes(event.target.files[0].type)) {
        this.loading = false;
        this.displayBotMessage1(this.msg= 'Invalid image type (only png, jpg, jpeg are allowed).');
      }

      else if (event.target.files[0].size > 3000000) {
        this.loading = false;
        this.displayBotMessage1(this.msg = 'Image size must be less than 1MB');
      }

      const skinImage: File = event.target.files[0];
      this.skinResultsService.uploadSkinImage(skinImage).subscribe(
        data => {
          console.log(data);
          this.result = data;
          this.loading = false;
          this.hideData = false;
          if(this.result.skinType==='Healthy skin'){
            this.displayImageMessageUser(this.msg='<img src="'+this.result.image+'" alt="Uploaded" width="300px" />');
            this.displayImageMessageBot(this.msg=
              '  <table class="card" style=" padding: 16px;' +
              '  box-shadow: 0 0 8px rgba(255,255,255,0.2); ' +
              '  background-color: rgba(0,0,0,0.2); '+
              '  border-radius: 2px; ' +
              '  margin-top: 0;' +
              '  margin-left: auto;' +
              '  margin-right: auto;"> ' +
              '    <tr class="stack" style="flex-direction: column;"> ' +
              '      <td class="grid" style="  horiz-align: center; ' +
              '  vertical-align: top;"> ' +
              '        <h5 class="title" style="  text-align: center; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif; ' +
              '  font-size: 22px;">Uploaded image</h5> ' +
              '        <img class="uploaded-image" style="  padding: 8px; ' +
              '  width: 300px; ' +
              '  object-fit: contain;" alt="Uploaded image" src="'+this.result.image+'" /> ' +
              '      </td> ' +
              '      <td class="grid2" style="horiz-align: center; ' +
              '  vertical-align: top; ' +
              '  border-left: 1px solid #ccc;"> ' +
              '        <h5 class="title" style="text-align: center; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif; ' +
              '  font-size: 22px;">Predictions</h5> ' +
              '        <div class="card-content"> ' +
              '          <ul class="list" style="list-style-type: none; ' +
              '  padding: 0;"> ' +
              '            <li style="display: flex; ' +
              '  align-items: center; ' +
              '  padding-left: 16px; ' +
              '  padding-right: 16px;"> ' +
              '              <div class="avatar" style="  border-radius:40px; ' +
              '  height: 40px; ' +
              '  width: 40px; ' +
              '  background-color: darkgray; ' +
              '  display: flex; ' +
              '  align-items: center; ' +
              '  justify-content: center; ' +
              '  margin-right: 16px;"> ' +
              '                <i class="fa-solid fa-virus-covid" style="color:red"></i> ' +
              '              </div> ' +
              '              <div class="list-item" style="border-bottom: 1px solid #ccc;"> ' +
              '                <p class="item-title" style="font-size: 17px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">Skin type</p> ' +
              '                <p class="item-text" style="  font-size: 15px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;"> '+this.result.skinType+'</p> ' +
              '              </div> ' +
              '            </li> ' +
              '            <li style="  display: flex; ' +
              '  align-items: center; ' +
              '  padding-left: 16px; ' +
              '  padding-right: 16px;"> ' +
              '              <div class="avatar" style="border-radius:40px; ' +
              '  height: 40px; ' +
              '  width: 40px; ' +
              '  background-color: darkgray; ' +
              '  display: flex; ' +
              '  align-items: center; ' +
              '  justify-content: center; ' +
              '  margin-right: 16px;"> ' +
              '                <i class="fa-solid fa-percent"></i> ' +
              '              </div> ' +
              '              <div class="list-item" style="border-bottom: 1px solid #ccc;"> ' +
              '                <p class="item-title" style="font-size: 17px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">Probability</p> ' +
              '                <p class="item-text" style=" font-size: 15px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;"> '+this.result.probability+' % </p> ' +
              '              </div> ' +
              '            </li> ' +
              '            <!-- Check if symptoms exist --> ' +
              '            <!-- If yes, loop through symptoms and generate list items --> ' +
              '          </ul> ' +
              '        </div> ' +
              '      </td> ' +
              '    </tr> ' +
              '  </table> ' +
              ' '

            );

          }
          else {
            this.displayImageMessageUser(this.msg='<img src="'+this.result.image+'" alt="Uploaded" width="300px" />');
            this.displayImageMessageBot(this.msg=
              '  <table class="card" style=" padding: 16px;' +
              '  box-shadow: 0 0 8px rgba(255,255,255,0.2); ' +
              '  background-color: rgba(0,0,0,0.2); '+
              '  border-radius: 2px; ' +
              '  margin-top: 0;' +
              '  margin-left: auto;' +
              '  margin-right: auto;"> ' +
              '    <tr class="stack" style="flex-direction: column;"> ' +
              '      <td class="grid" style="  horiz-align: center; ' +
              '  vertical-align: top;"> ' +
              '        <h5 class="title" style="  text-align: center; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif; ' +
              '  font-size: 22px;">Uploaded image</h5> ' +
              '        <img class="uploaded-image" style="  padding: 8px; ' +
              '  width: 300px; ' +
              '  object-fit: contain;" alt="Uploaded image" src="'+this.result.image+'" /> ' +
              '      </td> ' +
              '      <td class="grid2" style="horiz-align: center; ' +
              '  vertical-align: top; ' +
              '  border-left: 1px solid #ccc;"> ' +
              '        <h5 class="title" style="text-align: center; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif; ' +
              '  font-size: 22px;">Predictions</h5> ' +
              '        <div class="card-content"> ' +
              '          <ul class="list" style="list-style-type: none; ' +
              '  padding: 0;"> ' +
              '            <li style="display: flex; ' +
              '  align-items: center; ' +
              '  padding-left: 16px; ' +
              '  padding-right: 16px;"> ' +
              '              <div class="avatar" style="  border-radius:40px; ' +
              '  height: 40px; ' +
              '  width: 40px; ' +
              '  background-color: darkgray; ' +
              '  display: flex; ' +
              '  align-items: center; ' +
              '  justify-content: center; ' +
              '  margin-right: 16px;"> ' +
              '                <i class="fa-solid fa-virus-covid" style="color:red"></i> ' +
              '              </div> ' +
              '              <div class="list-item" style="border-bottom: 1px solid #ccc;"> ' +
              '                <p class="item-title" style="font-size: 17px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">Skin type</p> ' +
              '                <p class="item-text" style="  font-size: 15px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;"> '+this.result.skinType+'</p> ' +
              '              </div> ' +
              '            </li> ' +
              '            <li style="  display: flex; ' +
              '  align-items: center; ' +
              '  padding-left: 16px; ' +
              '  padding-right: 16px;"> ' +
              '              <div class="avatar" style="border-radius:40px; ' +
              '  height: 40px; ' +
              '  width: 40px; ' +
              '  background-color: darkgray; ' +
              '  display: flex; ' +
              '  align-items: center; ' +
              '  justify-content: center; ' +
              '  margin-right: 16px;"> ' +
              '                <i class="fa-solid fa-percent"></i> ' +
              '              </div> ' +
              '              <div class="list-item" style="border-bottom: 1px solid #ccc;"> ' +
              '                <p class="item-title" style="font-size: 17px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">Probability</p> ' +
              '                <p class="item-text" style=" font-size: 15px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;"> '+this.result.probability+' % </p> ' +
              '              </div> ' +
              '            </li> ' +
              '            <!-- Check if symptoms exist --> ' +
              '            <!-- If yes, loop through symptoms and generate list items --> ' +
              '            <li style=" display: flex; ' +
              '  align-items: center; ' +
              '  padding-left: 16px; ' +
              '  padding-right: 16px;"> ' +
              '              <div class="avatar" style="border-radius:40px; ' +
              '  height: 40px; ' +
              '  width: 40px; ' +
              '  background-color: darkgray; ' +
              '  display: flex; ' +
              '  align-items: center; ' +
              '  justify-content: center; ' +
              '  margin-right: 16px;"> ' +
              '                <i class="fa-solid fa-magnifying-glass" style="color: saddlebrown"></i> ' +
              '              </div> ' +
              '              <div class="list-item" style="border-bottom: 1px solid #ccc;"> ' +
              '                <p class="item-title" style=" font-size: 17px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">Symptoms</p> ' +
              '                <p class="item-text" style=" font-size: 15px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;"> '+this.result.symptoms+'</p> ' +
              '              </div> ' +
              '            </li> ' +
              '            <!-- Check if treatments exist --> ' +
              '            <!-- If yes, loop through treatments and generate list items --> ' +
              '            <li style=" display: flex; ' +
              '  align-items: center; ' +
              '  padding-left: 16px; ' +
              '  padding-right: 16px;"> ' +
              '              <div class="avatar" style=" border-radius:40px; ' +
              '  height: 40px; ' +
              '  width: 40px; ' +
              '  background-color: darkgray; ' +
              '  display: flex; ' +
              '  align-items: center; ' +
              '  justify-content: center; ' +
              '  margin-right: 16px;"> ' +
              '                <i class="fa-solid fa-book-medical" style="color: dodgerblue"></i> ' +
              '              </div> ' +
              '              <div class="list-item" style="border-bottom: 1px solid #ccc;"> ' +
              '                <p class="item-title" style="font-size: 17px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">Treatments</p> ' +
              '                <p class="item-text" style="font-size: 15px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;"> '+this.result.treatments+'</p> ' +
              '              </div> ' +
              '            </li> ' +
              '            <!-- Check if howCommon exists --> ' +
              '            <li style="display: flex; ' +
              '  align-items: center; ' +
              '  padding-left: 16px; ' +
              '  padding-right: 16px;"> ' +
              '              <div class="avatar" style="border-radius:40px; ' +
              '  height: 40px; ' +
              '  width: 40px; ' +
              '  background-color: darkgray; ' +
              '  display: flex; ' +
              '  align-items: center; ' +
              '  justify-content: center; ' +
              '  margin-right: 16px;"> ' +
              '                <i class="fa-solid fa-users" style="color: yellow"></i> ' +
              '              </div> ' +
              '              <div class="list-item" style="border-bottom: 1px solid #ccc;"> ' +
              '                <p class="item-title" '+'style="font-size: 17px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">How common</p> ' +
              '                <p class="item-text" style="font-size: 15px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">'+this.result.howCommon+'</p> ' +
              '              </div> ' +
              '            </li> ' +
              '            <!-- Check if duration exists --> ' +
              '            <li style="  display: flex; ' +
              '  align-items: center; ' +
              '  padding-left: 16px; ' +
              '  padding-right: 16px; "> ' +
              '              <div class="avatar" style="  border-radius:40px; ' +
              '  height: 40px; ' +
              '  width: 40px; ' +
              '  background-color: darkgray; ' +
              '  display: flex; ' +
              '  align-items: center; ' +
              '  justify-content: center; ' +
              '  margin-right: 16px;"> ' +
              '                <i class="fa-regular fa-clock" style="color: steelblue"></i> ' +
              '              </div> ' +
              '              <div class="list-item" style="border-bottom: 1px solid #ccc;"> ' +
              '                <p class="item-title" style="font-size: 17px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;">Duration</p> ' +
              '                <p class="item-text" style="  font-size: 15px; ' +
              '  font-weight: bold; ' +
              '  font-family: Helvetica, sans-serif;"> '+this.result.duration+'</p> ' +
              '              </div> ' +
              '            </li> ' +
              '          </ul> ' +
              '        </div> ' +
              '      </td> ' +
              '    </tr> ' +
              '  </table> ' +
              ' '

            );
          }
          this.chatbotService.chatbot("the result of processing the user skin image is Skin type: "+this.result.skinType+"Probability: "+this.result.probability+"% ask me 5 yes or no question to verify if he really have this skin type or this skin pathology and Do not ask all the questions at once, send each question separately and after I reply with yes or no ask me the next question until the user answer all the questions after I answer all the question tell me the result of the quiz", 'system').subscribe(
            data => {
              this.resp= data
              console.log(data);
              this.displayBotMessage1(this.resp.output.content);
            },
            error => {
              console.log(error);
              this.msg = 'error';
            }
          )
        },
        error => {
          console.log(error);
          this.err= error;
          this.loading = false;
          if (this.err.status===401) {
            this.displayBotMessage1(this.msg = 'Token expired. You must login to continue');
            setTimeout(() => {
              this.tokenstorageService.logOut();}, 4000);
          }
          else if (this.err.status === 500) {

            this.displayBotMessage1(this.msg = 'Failed to connect to the server.');
          }

          else {
            this.displayBotMessage1(this.msg = 'Invalid image.');
          }
        });
    }
  }
}
