import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SkinResults} from "../../models/skin-results.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SkinResultsService {
  private baseURL = 'http://localhost:3001/api/v1/skin-results/';
  constructor(private httpClient: HttpClient) { }

  uploadSkinImage(skinimage: string): Observable<Object>{
    return this.httpClient.post(`${this.baseURL}`, skinimage);
  }
  getPreviousResults(): Observable<SkinResults[]>{
    return this.httpClient.get<SkinResults[]>(`${this.baseURL}`);
  }

  getResultById(id: number): Observable<SkinResults>{
    return this.httpClient.get<SkinResults>(`${this.baseURL}/${id}`);
  }

  // updateResult(id: number, candidat: Candidat): Observable<Object>{
  //   return this.httpClient.put(`${this.baseURL}/${id}`, candidat);
  // }
  //
  // deleteResult(id: number): Observable<Object>{
  //   return this.httpClient.delete(`${this.baseURL}/${id}`);
  // }
}
