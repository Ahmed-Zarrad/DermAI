import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';
import {JwtResponse} from "../../models/jwt-response.model";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private baseUrl = 'http://localhost:3001/api/v1/chatbot/chat';
  constructor(private httpClient: HttpClient) { }
  chatbot(content: string, role: string): Observable<any> {
    const requestData =
        {
          role: role,
          content: content,
        };
    return this.httpClient.post(`${this.baseUrl}/65357c51f60edb450b395adb/message`, requestData, httpOptions)

      .pipe((data => {


        this.chatbot;
        return data;
      }));
  }
  getAllChats(): Observable<any> {
    return this.httpClient.get(this.baseUrl);
  }
  crateChat() {
    return this.httpClient.post<JwtResponse>(this.baseUrl, httpOptions)
      .pipe(data => {
        return data;
      });
  }
  deleteChat(idChat: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${idChat}`, { responseType: 'text' });
  }
  getAllMessages(idChat: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${idChat}/message`);
  }
}
