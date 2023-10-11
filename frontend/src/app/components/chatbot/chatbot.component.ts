import { Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Message} from "../../models/message.model";
import { Router } from '@angular/router';
import {SkinResultsService} from "../../services/skin-results/skin-results.service";
import {ChatbotService} from "../../services/chatbot/chatbot.service";
// @ts-ignore
import {TokenstorageService} from "../../services/tokenstorage/tokenstorage.service";
import {DomSanitizer} from "@angular/platform-browser";
@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value:any) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  chatLog: Message[] = [];
  userInput: any;
  hideData: boolean = true;
  dispatch: any;
  err: any
  result: any = null;
  resp: any = null;
  response: any;
  loading = false;
  msg: any;
  initialRowHeight = 20;
  hideWindow: boolean =true
  hidden: boolean=true;
  isTyping = false;
  constructor(private chatbotService: ChatbotService, private router: Router,
              private skinResultsService: SkinResultsService, private tokenstorageService: TokenstorageService) {

    this.router = router;
  }

  ngOnInit(): void {
    this.tokenstorageService.hideWindow.subscribe((value: any)=>{
      this.hideWindow = value;
    });
  }


  sendMessage(): void {
    const message = this.userInput.trim();
    if (message.length === 0) return;
    this.loading = true;
    this.hideData = false;
    this.displayUserMessage(message);
    this.userInput = '';
    this.chatbotService.chatbot(message, 'user').subscribe(
      data => {
        this.resp= data
        this.loading = false;
        console.log(data);
        this.displayBotMessage1(this.resp.output.content);
      },
      error => {
        console.log(error);
        this.msg = 'error';
      }
    )
    // this.processUserMessage(message);
  }

  displayUserMessage(message: any): void {
    const UserMessage = '<div style="display: table;padding: 5px;align-items: center;"> ' +
      '<img  src="../../../assets/imgs/mainphotosquare.png"'+
      ' style= "  width: 4vh;' + '  height: 4vh;'+'  border-radius: 100%;'+'  cursor: pointer;' +
      '  outline: none; margin-left: 300px;margin-right: 20px;vertical-align: middle'+ '" alt="">'+
      '<div style="display: table-cell; vertical-align: middle;">'+'<strong>Ahmed : </strong>'+ message +'</div></div>' ;
    this.chatLog.push({content: UserMessage, role: 'user', backgroundColor: '#343541',color: 'white', textAlign: 'left'});
  }
  displayBotMessage1(message: any): void {
    const BotMessage = '<div style="display: table;padding: 5px;align-items: center;">'+
      '<img  src="../../../assets/imgs/logoDermAI.png" style="  width: 4vh;' +
      '  height: 4vh;'+'  border-radius: 100%;' +'  cursor: pointer;'+
      '  outline: none; margin-left: 300px;margin-right: 20px; background-color: white;vertical-align: middle'+
      '" alt="">'+'<div style="display: table-cell; vertical-align: middle;">'+'<strong>DermAI : </strong>' + message + '</div></div>' ;
    this.chatLog.push({content: BotMessage, role: 'bot', backgroundColor: '#444654', color: 'white', textAlign: 'left'});
  }

  displayImageMessageUser(message: any): void {
    const BotMessage = '<div style="display: table;padding: 5px;align-items: center;">'+
      '<img  src="../../../assets/imgs/logoDermAI.png" style="  width: 4vh;' +
      '  height: 4vh;'+'  border-radius: 100%;' +'  cursor: pointer;'+
      '  outline: none; margin-left: 300px;margin-right: 20px; background-color: white;vertical-align: middle'+
      '" alt="">'+'<div style="display: table-cell; vertical-align: middle;">'+ message + '</div></div>' ;

    this.chatLog.push({ content: BotMessage, role: 'bot', backgroundColor: '#444654', color: 'white'});
  }
  displayImageMessageBot(message: any): void {
    const BotMessage = '<div style="display: table;padding: 5px;align-items: center;">'+
      '<img  src="../../../assets/imgs/logoDermAI.png" style="  width: 4vh;' +
      '  height: 4vh;'+'  border-radius: 100%;' +'  cursor: pointer;'+
      '  outline: none; margin-left: 300px;margin-right: 20px; background-color: white;vertical-align: middle'+
      '" alt="">'+'<div style="display: table-cell; vertical-align: middle;">'+ message + '</div></div>' ;

    this.chatLog.push({ content: BotMessage, role: 'bot', backgroundColor: '#444654', color: 'white'});
  }
  displayBotMessage2(message: any): void {
    this.chatLog.push({content: '', role: 'bot', backgroundColor: '#444654', color: 'white', textAlign: 'left'});
    const words = message.split(' ');
    let currentWordIndex = 0;

    const showNextWord = () => {
      if (currentWordIndex < words.length) {
        const word = words[currentWordIndex];
          const lastMessageIndex = this.chatLog.length - 1;
          this.chatLog[lastMessageIndex].content += ' ' + word;

        currentWordIndex++;
        setTimeout(showNextWord, 300); // Adjust the delay (in milliseconds) between words here
      }
    };
    showNextWord();
  }



  // processUserMessage(message: any): void {
  //    this.response = '';
  //   if (message.toLowerCase() === 'bonjour') {
  //     this.response = 'Bonjour, comment puis-je vous aider aujourd\'hui?';
  //   } else if (message.toLowerCase() === 'j\'ai une photo de la condition de la peau') {
  //     this.response = 'Bien sûr, veuillez envoyer une photo de votre état de peau.';
  //   } else if (message.toLowerCase() === 'test') {
  //     this.response = '<div  id="test">sddsd</div>';
  //   }else {
  //     // Default response for unrecognized inputs
  //     this.response = 'Désolé, je ne peux pas comprendre votre demande.';
  //   }
  //
  //   setTimeout(() => {
  //     this.displayBotMessage1(this.response);
  //   }, 1000);
  // }

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
          this.chatbotService.chatbot("the result of processing the user skin image is Skin type: "+this.result.skinType+"Probability: "+this.result.probability+"% ask me 5 yes or no question to verify if he really have this skin type or this skin pathology and Do not ask all the questions at once, send each question separately and after I reply with yes or no ask me the next question until the user answer all the questions after I answer all the question tell me the result of the quiz", 'user').subscribe(
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
  autoResize(event: Event): void {
    const element = event.target as HTMLTextAreaElement;
    element.style.height = `${this.initialRowHeight}px`;
    element.style.height = `${element.scrollHeight}px`;
  }
}
