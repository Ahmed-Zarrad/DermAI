import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SkinResults} from "../../models/skin-results.model";
// @ts-ignore
import {TokenstorageService} from "../tokenstorage/tokenstorage.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SkinResultsService {
  private baseUrl = 'http://localhost:3001/api/v1/skin-results/';
  constructor(private httpClient: HttpClient, private tokenstorage: TokenstorageService, private router: Router) { }

  public async uploadSkinImage(imageObj: File): Promise<any> {
    const formData = new FormData();
    formData.append('skinImage', imageObj);

    return this.httpClient.post(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${this.tokenstorage.getToken()}`,
      },
    });
  }

  public async getPreviousResults(): Promise<any> {
    return this.httpClient.get(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${this.tokenstorage.getToken()}`,
      },
    });
  }

  public async getResultById(id: string): Promise<any> {
    return this.httpClient.get(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.tokenstorage.getToken()}`,
      },
    });
  }
}
