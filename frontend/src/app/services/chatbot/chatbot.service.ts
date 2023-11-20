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
  private baseUrl = 'http://localhost:3001/api/v1/chats';
  constructor(private httpClient: HttpClient) { }
  chatbot(content: any, role: any, idChat: any): Observable<any> {
    const requestData =
        {
          role: role,
          content: content,
        };
    return this.httpClient.post(`${this.baseUrl}/${idChat}/chatbot/message`, requestData, httpOptions)

      .pipe((data => {


        this.chatbot;
        return data;
      }));
  }
  getAllChats(type: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${type}`);
  }
  crateChat(type: any) {
    return this.httpClient.post<JwtResponse>(`${this.baseUrl}/${type}`, httpOptions)
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
