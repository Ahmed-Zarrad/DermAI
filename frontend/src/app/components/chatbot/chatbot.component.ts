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


  // displayBotMessage(message: string): void {
  //   this.chatLog.push({ content: message, type: 'bot' });
  // }
  displayBotMessage(message: string): void {
    const words = message.split(' ');
    let currentWordIndex = 0;

    const showNextWord = () => {
      if (currentWordIndex < words.length) {
        const word = words[currentWordIndex];

        // Check if it's the first word to be displayed
        if (this.chatLog.length === 0 || this.chatLog[this.chatLog.length - 1].type === 'user') {
          this.chatLog.push({content: word, type: 'bot', backgroundColor: '#444654'});
        } else {
          // Append the word to the previous bot message
          const lastMessageIndex = this.chatLog.length - 1;
          this.chatLog[lastMessageIndex].content += ' ' + word;
        }

        currentWordIndex++;
        setTimeout(showNextWord, 300); // Adjust the delay (in milliseconds) between words here
      }
    };
    showNextWord();
  }


  processUserMessage(message: string): void {
    let response = '';

    if (message.toLowerCase() === 'bonjour') {
      response = 'Bonjour, comment puis-je vous aider aujourd\'hui?';
    } else if (message.toLowerCase() === 'j\'ai une photo de la condition de la peau') {
      response = 'Bien sûr, veuillez envoyer une photo de votre état de peau.';
    } else {
      // Default response for unrecognized inputs
      response = 'Désolé, je ne peux pas comprendre votre demande.';
    }

    setTimeout(() => {
      this.displayBotMessage(response);
    }, 1000);
  }

  async handleImageUpload(e: any) {
    this.loading = true;
    if (e.target.files.length > 0) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!allowedTypes.includes(e.target.files[0].type)) {
        this.loading = false;
        return this.msg = 'Invalid image type (only png, jpg, jpeg are allowed).'
      }

      if (e.target.files[0].size > 3000000) {
        this.loading = false;
        return this.dispatch({
          type: 'UPDATE_NOTIFICATION',
          payload: {
            msg: 'Image size must be less than 1MB',
            error: true
          }
        });
      }

      try {
        const data = await this.skinResultsService.uploadSkinImage(e.target.files[0]);

        this.result = data;
        this.loading = false;
        this.msg='';
      } catch (err) {
        this.loading = false;

        if (this.err.response && this.err.response.status === 500) {

          return this.msg = 'Failed to connect to the server.';
        }

        if (this.err.response && this.err.response.data?.error?.token) {
          this.tokenstorageService.logOut();


          this.router.navigate(['/']);

          return this.msg = 'Token expired. You must login to continue';
        }
      }

      if (this.err.response && this.err.response.data) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (and the server sends error message)

        return this.msg = 'Invalid image.';
      }
    }
    return this.msg = 'Failed to connect to the server.';
  }
}
