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
  showData: boolean = false;
  dispatch: any;
  err: any
  result: any = null;
  loading = false;
  msg = '';
  test: any;


  constructor(private router: Router, private skinResultsService: SkinResultsService, private tokenstorageService: TokenstorageService) {

    this.router = router;

  }

  ngOnInit(): void {

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
          this.displayUserMessage(this.msg='<img src="'+this.result.image+'" alt="Uploaded" width="300px" />');
          this.displayBotMessage(this.msg='<img src="'+this.result.image+'" alt="Uploaded" width="300px" />');
          this.displayImageMessage(this.msg='<img src="http://res.cloudinary.com/dhttl3pbz/image/upload/v1686904531/skin-images/yrn5btdivmztqjl7nwex.jpg" alt="Uploaded" width="300px" />');
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
}
