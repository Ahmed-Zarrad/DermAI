import { Component, OnInit } from '@angular/core';
import {Message} from "../../models/message.model";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  chatLog: Message[] = [];
  userInput: string = '';
  hideData: boolean =true;
  showData: boolean =false;
  constructor(){}
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
    this.chatLog.push({ content: message, type: 'user',backgroundColor:'#343541' });
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
          this.chatLog.push({ content: word, type: 'bot',backgroundColor:'#444654' });
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

}
