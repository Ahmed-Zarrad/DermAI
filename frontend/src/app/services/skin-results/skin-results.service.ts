import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SkinResults} from "../../models/skin-results.model";
// @ts-ignore
import {TokenstorageService} from "../tokenstorage/tokenstorage.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
};

@Injectable({
  providedIn: 'root'
})
export class SkinResultsService {
  private baseUrl = 'http://localhost:3001/api/v1/skin-results/';
  constructor(private httpClient: HttpClient, private tokenstorage: TokenstorageService, private router: Router) { }

  // public  uploadSkinImage(imageObj: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('skinImage', imageObj);
  //
  //   return this.httpClient.post(this.baseUrl, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${this.tokenstorage.getToken()}`,
  //     },
  //   });
  // }
  uploadSkinImage(skinImage: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('skinImage', skinImage);

    return this.httpClient.post(this.baseUrl, formData);
  }
  // uploadSkinImage(skinImage: File): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', skinImage);
  //
  //
  //   return this.httpClient.post(this.baseUrl, formData, httpOptions);
  // }

  // getPreviousResults(): Observable<SkinResults[]>{
  //   return this.httpClient.get<SkinResults[]>(`${this.baseURL}`);
  // }
  //
  // getResultById(id: number): Observable<SkinResults>{
  //   return this.httpClient.get<SkinResults>(`${this.baseURL}/${id}`);
  // }

  // public async getPreviousResults(): Promise<any> {
  //   return this.httpClient.get(this.baseUrl, {
  //     headers: {
  //       Authorization: `Bearer ${this.tokenstorage.getToken()}`,
  //     },
  //   });
  // }
  //
  // public async getResultById(id: string): Promise<any> {
  //   return this.httpClient.get(`${this.baseUrl}/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${this.tokenstorage.getToken()}`,
  //     },
  //   });
  // }
}
