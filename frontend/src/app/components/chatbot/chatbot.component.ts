import { Component, OnInit } from '@angular/core';
import {Message} from "../../models/message.model";
import { Router } from '@angular/router';
import {SkinResultsService} from "../../services/skin-results/skin-results.service";
// @ts-ignore
import {TokenstorageService} from "../../services/tokenstorage/tokenstorage.service";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  chatLog: Message[] = [];
  userInput: string = '';
  hideData: boolean = true;
  dispatch: any;
  err: any
  result: any = null;
  loading = false;
  msg = '';
  test: any;
  initialRowHeight = 20;
  hideWindow: boolean =true
  constructor(private router: Router, private skinResultsService: SkinResultsService, private tokenstorageService: TokenstorageService) {

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

    this.displayUserMessage(message);
    this.processUserMessage(message);

    this.userInput = '';
    this.hideData = false;
  }

  displayUserMessage(message: string): void {
    this.chatLog.push({content: message, type: 'user', backgroundColor: '#343541'});
  }
  displayImageMessage(message: string): void {
    const wrappedMessage = '<span>' + message + '</span>';
    this.chatLog.push({content: wrappedMessage, type: 'user', backgroundColor: '#343541'});
  }

  displayBotMessage(message: string): void {
    this.chatLog.push({ content: message, type: 'bot', backgroundColor: '#444654' });
  }
  // displayBotMessage(message: string): void {
  //   const words = message.split(' ');
  //   let currentWordIndex = 0;
  //
  //   const showNextWord = () => {
  //     if (currentWordIndex < words.length) {
  //       const word = words[currentWordIndex];
  //
  //       // Check if it's the first word to be displayed
  //       if (this.chatLog.length === 0 || this.chatLog[this.chatLog.length - 1].type === 'user') {
  //         this.chatLog.push({content: word, type: 'bot', backgroundColor: '#444654'});
  //       } else {
  //         // Append the word to the previous bot message
  //         const lastMessageIndex = this.chatLog.length - 1;
  //         this.chatLog[lastMessageIndex].content += ' ' + word;
  //       }
  //
  //       currentWordIndex++;
  //       setTimeout(showNextWord, 300); // Adjust the delay (in milliseconds) between words here
  //     }
  //   };
  //   showNextWord();
  // }


  processUserMessage(message: string): void {
    let response = '';

    if (message.toLowerCase() === 'bonjour') {
      response = 'Bonjour, comment puis-je vous aider aujourd\'hui?';
    } else if (message.toLowerCase() === 'j\'ai une photo de la condition de la peau') {
      response = 'Bien sûr, veuillez envoyer une photo de votre état de peau.';
     }else {
      // Default response for unrecognized inputs
      response = 'Désolé, je ne peux pas comprendre votre demande.';
    }

    setTimeout(() => {
      this.displayBotMessage(response);
    }, 1000);
  }

  handleImageUpload(event: any):void {
    this.loading = true;
    if (event.target.files.length > 0) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!allowedTypes.includes(event.target.files[0].type)) {
        this.loading = false;
        this.displayBotMessage(this.msg= 'Invalid image type (only png, jpg, jpeg are allowed).');
      }

      else if (event.target.files[0].size > 3000000) {
        this.loading = false;
        this.displayBotMessage(this.msg = 'Image size must be less than 1MB');
      }

      const skinImage: File = event.target.files[0];
      this.skinResultsService.uploadSkinImage(skinImage).subscribe(
        data => {
          console.log(data);
          this.result = data;
          this.loading = false;
          this.hideData = false;
          this.displayUserMessage(this.msg='<img src="'+this.result.image+'" alt="Uploaded" width="300px" />');
          this.displayBotMessage(this.msg='<table><tr>'+'<td>'+'<img src="'+this.result.image+'" alt="Uploaded" width="300px" />'+'</td>'+'<td>'+
            '                <div>'+this.result.skinType+'</div>' +
            '                <div>'+this.result.probability+'</div>' +
            '                <div>'+this.result.symptoms+'</div>' +
            '                <div>'+this.result.howCommon+'</div>' +
            '                <div>'+this.result.treatments+'</div>' +
            '                <div>'+this.result.duration+'</div>'+'</td>'+'</tr>'+'</table>');
          this.displayBotMessage(this.msg= ' <style> .container { ' +
            '          margin-top: 100px; ' +
            '          margin-left: 20px; ' +
            ' ' +
            ' ' +
            '        } ' +
            ' ' +
            '        .card { ' +
            '          padding: 16px; ' +
            '          box-shadow: 0 0 8px rgba(0, 0, 0, 0.2); ' +
            '          border-radius: 2px; ' +
            '          margin-top: 0; ' +
            ' ' +
            ' ' +
            '        } ' +
            ' ' +
            '        .stack { ' +
            '          flex-direction: column; ' +
            '        } ' +
            ' ' +
            '        .grid { ' +
            '          horiz-align: center; ' +
            '          vertical-align: top; ' +
            '        } ' +
            '        .grid2{ ' +
            '          horiz-align: center; ' +
            '          vertical-align: top; ' +
            '          border-left: 1px solid #ccc; ' +
            '        } ' +
            ' ' +
            '        .title { ' +
            '          text-align: center; ' +
            '          font-weight: bold; ' +
            '          font-family: Helvetica, sans-serif; ' +
            '          font-size: 22px; ' +
            '        } ' +
            ' ' +
            '        .uploaded-image { ' +
            '          padding: 8px; ' +
            '          width: 300px; ' +
            '          object-fit: contain; ' +
            '        } ' +
            ' ' +
            '        .card-content { ' +
            '        } ' +
            ' ' +
            '        .list { ' +
            '          list-style-type: none; ' +
            '          padding: 0; ' +
            ' ' +
            ' ' +
            '        } ' +
            ' ' +
            '        .list li { ' +
            '          display: flex; ' +
            '          align-items: center; ' +
            '          padding-left: 16px; ' +
            '          padding-right: 16px; ' +
            ' ' +
            '        } ' +
            ' ' +
            '        .avatar { ' +
            ' ' +
            '          border-radius:40px; ' +
            '          height: 40px; ' +
            '          width: 40px; ' +
            '          background-color: darkgray; ' +
            '          display: flex; ' +
            '          align-items: center; ' +
            '          justify-content: center; ' +
            '          margin-right: 16px; ' +
            '        } ' +
            ' ' +
            '        .avatar i { ' +
            ' ' +
            '        } ' +
            '        .list-item{ ' +
            '          border-bottom: 1px solid #ccc; ' +
            '        } ' +
            '        .item-title { ' +
            '          font-size: 17px; ' +
            '          font-weight: bold; ' +
            '          font-family: Helvetica, sans-serif; ' +
            '        } ' +
            ' ' +
            '        .item-text { ' +
            '          font-size: 15px; ' +
            '          font-weight: bold; ' +
            '          font-family: Helvetica, sans-serif; ' +
            '        } ' +
            '        </style>'+
            '  <table class="card"> ' +
            '    <tr class="stack"> ' +
            '      <td class="grid"> ' +
            '        <h5 class="title">Uploaded image</h5> ' +
            '        <img class="uploaded-image" alt="Uploaded image" src="'+this.result.image+'" /> ' +
            '      </td> ' +
            '      <td class="grid2"> ' +
            '        <h5 class="title">Predictions</h5> ' +
            '        <div class="card-content"> ' +
            '          <ul class="list"> ' +
            '            <li> ' +
            '              <div class="avatar"> ' +
            '                <i class="fa-solid fa-virus-covid" [ngStyle]="{ color: \'red\' }"></i> ' +
            '              </div> ' +
            '              <div class="list-item"> ' +
            '                <p class="item-title">Skin type</p> ' +
            '                <p class="item-text"> '+this.result.skinType+'</p> ' +
            '              </div> ' +
            '            </li> ' +
            '            <li> ' +
            '              <div class="avatar"> ' +
            '                <i class="fa-solid fa-percent"></i> ' +
            '              </div> ' +
            '              <div class="list-item"> ' +
            '                <p class="item-title">Probability</p> ' +
            '                <p class="item-text"> '+this.result.probability+' % </p> ' +
            '              </div> ' +
            '            </li> ' +
            '            <!-- Check if symptoms exist --> ' +
            '            <!-- If yes, loop through symptoms and generate list items --> ' +
            '            <li> ' +
            '              <div class="avatar"> ' +
            '                <i class="fa-solid fa-magnifying-glass" style="color: saddlebrown"></i> ' +
            '              </div> ' +
            '              <div class="list-item"> ' +
            '                <p class="item-title">Symptoms</p> ' +
            '                <p class="item-text"> '+this.result.symptoms+'</p> ' +
            '              </div> ' +
            '            </li> ' +
            '            <!-- Check if treatments exist --> ' +
            '            <!-- If yes, loop through treatments and generate list items --> ' +
            '            <li> ' +
            '              <div class="avatar"> ' +
            '                <i class="fa-solid fa-book-medical" style="color: dodgerblue"></i> ' +
            '              </div> ' +
            '              <div class="list-item"> ' +
            '                <p class="item-title">Treatments</p> ' +
            '                <p class="item-text"> '+this.result.treatments+'</p> ' +
            '              </div> ' +
            '            </li> ' +
            '            <!-- Check if howCommon exists --> ' +
            '            <li> ' +
            '              <div class="avatar"> ' +
            '                <i class="fa-solid fa-users" style="color: yellow"></i> ' +
            '              </div> ' +
            '              <div class="list-item"> ' +
            '                <p class="item-title">How common</p> ' +
            '                <p class="item-text">'+this.result.howCommon+'</p> ' +
            '              </div> ' +
            '            </li> ' +
            '            <!-- Check if duration exists --> ' +
            '            <li> ' +
            '              <div class="avatar"> ' +
            '                <i class="fa-regular fa-clock" style="color: steelblue"></i> ' +
            '              </div> ' +
            '              <div class="list-item"> ' +
            '                <p class="item-title">Duration</p> ' +
            '                <p class="item-text"> '+this.result.duration+'</p> ' +
            '              </div> ' +
            '            </li> ' +
            '          </ul> ' +
            '        </div> ' +
            '      </td> ' +
            '    </tr> ' +
            '  </table> ' +
            ' '

          );
        },
        error => {
          console.log(error);
          this.err= error;
          this.loading = false;
          if (this.err.status===401) {
            this.displayBotMessage(this.msg = 'Token expired. You must login to continue');
            setTimeout(() => {
            this.tokenstorageService.logOut();}, 4000);
          }
          else if (this.err.status === 500) {

            this.displayBotMessage(this.msg = 'Failed to connect to the server.');
      }

      else {
            this.displayBotMessage(this.msg = 'Invalid image.');
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
