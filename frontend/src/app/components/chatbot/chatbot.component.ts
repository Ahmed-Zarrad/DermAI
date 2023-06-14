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

  // async handleImageUpload(event: any) {
  //   this.loading = true;
  //   if (event.target.files.length > 0) {
  //     const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  //
  //     if (!allowedTypes.includes(event.target.files[0].type)) {
  //       this.loading = false;
  //       return this.msg = 'Invalid image type (only png, jpg, jpeg are allowed).'
  //     }
  //
  //     if (event.target.files[0].size > 3000000) {
  //       this.loading = false;
  //       return this.msg= 'Image size must be less than 1MB';
  //         }
  //
  //     try {
  //       const data = await this.skinResultsService.uploadSkinImage(event.target.files[0]);
  //
  //       this.result = data;
  //       this.loading = false;
  //       this.msg = '';
  //     } catch (err) {
  //       this.loading = false;
  //
  //       if (this.err.response && this.err.response.status === 500) {
  //
  //         return this.msg = 'Failed to connect to the server.';
  //       }
  //
  //       if (this.err.response && this.err.response.data?.error?.token) {
  //         this.tokenstorageService.logOut();
  //
  //
  //         //this.router.navigate(['/']);
  //
  //         return this.msg = 'Token expired. You must login to continue';
  //       }
  //
  //
  //       if (this.err.response && this.err.response.data) {
  //         // The request was made and the server responded with a status code
  //         // that falls out of the range of 2xx (and the server sends error message)
  //
  //         return this.msg = 'Invalid image.';
  //       }
  //
  //       return this.msg = 'Failed to connect to the server.';
  //     }
  //     return this.msg = 'success';
  //   }
  //   return this.msg = 'success2';
  // }
  // handleImageUpload(event: any): void {
  //   this.loading = true;
  //   const file = event.target.files[0];
  //
  //   if (file) {
  //     const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  //
  //     if (!allowedTypes.includes(file.type)) {
  //       this.setMsg('Invalid image type (only png, jpg, jpeg are allowed).');
  //       this.loading = false;
  //       return;
  //     }
  //
  //     if (file.size > 3000000) {
  //       this.setMsg('Invalid image type (only png, jpg, jpeg are allowed).');
  //       this.loading = false;
  //       return;
  //     }
  //
  //     this.skinResultsService.uploadSkinImage(file).then(
  //       data => {
  //         console.log(data);
  //         this.result = data;
  //         this.loading = false;
  //         this.setMsg('');
  //       },
  //       error => {
  //         console.log(error);
  //         this.loading = false;
  //
  //         if (error.response && error.response.status === 500) {
  //           this.setMsg('Invalid image type (only png, jpg, jpeg are allowed).');
  //           return;
  //         }
  //
  //         if (error.response && error.response.data?.error?.token) {
  //           this.tokenstorageService.logOut();
  //           this.router.navigate(['/']);
  //           this.setMsg('token');
  //           return;
  //         }
  //
  //         if (error.response && error.response.data) {
  //           this.setMsg('Invalid image type (only png, jpg, jpeg are allowed).');
  //           return;
  //         }
  //
  //         this.setMsg('Invalid image type (only png, jpg, jpeg are allowed).');
  //       });
  //   }
  // }

  setMsg(message: string): void {
    this.msg = message;
  }
  // handleImageUpload(event: any){
  //   this.loading = true;
  //   const skinImage:File = event.target.files[0];
  //   this.skinResultsService.uploadSkinImage(skinImage).subscribe(
  //         data => {
  //           console.log(data);
  //           this.result = data;
  //           this.loading = false;
  //           this.setMsg('success');
  //         },
  //         error => {
  //           console.log(error);
  //           this.loading = false;
  //           this.setMsg('erooorrr');
  //         });
  // }
  handleImageUpload(event: any) {
    this.loading = true;
    const skinImage: File = event.target.files[0];
    this.skinResultsService.uploadSkinImage(skinImage).subscribe(
      data => {
        console.log(data);
        this.result = data;
        this.loading = false;
        this.setMsg('success');
        // Set success message or perform any other actions
      },
      error => {
        console.log(error);
        this.loading = false;
        this.setMsg('erooorrr');
        // Set error message or perform any other error handling
      }
    );
  }
}
