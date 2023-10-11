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

  uploadSkinImage(skinImage: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('skinImage', skinImage);

    return this.httpClient.post(this.baseUrl, formData);
  }
}
