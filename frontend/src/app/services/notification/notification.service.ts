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
export class NotificationService {

  private baseUrl = 'http://localhost:3001/api/v1/notifications';
  constructor(private httpClient: HttpClient) { }

  getAllnotifications(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}`);
  }
  addNotification(userId: any, title:  any, description: any, image: any): Observable<any> {
    const requestData =
      {
        title : title,
        description: description,
        image: image,
      };
    return this.httpClient.post<JwtResponse>(`${this.baseUrl}/${userId}`, requestData, httpOptions)
      .pipe(data => {
        return data;
      });
  }

  deleteNotification(idNotification: any): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${idNotification}`, { responseType: 'text' });
  }
}
