import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {JwtResponse} from "../../models/jwt-response.model";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private baseUrl = 'http://localhost:3001/api/v1/chatbot/chat/65357c51f60edb450b395adb/message';
  constructor(private httpClient: HttpClient) { }
  chatbot(content: string, role: string): Observable<any> {
    const requestData =
        {
          role: role,
          content: content,
        };
    return this.httpClient.post(this.baseUrl, requestData, httpOptions)

      .pipe((data => {


        this.chatbot;
        return data;
      }));
  }
}
