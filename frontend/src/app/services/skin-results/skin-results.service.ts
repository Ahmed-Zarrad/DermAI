import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SkinResultsService {
  private baseUrl = 'http://localhost:3001/api/v1/skin-results/';
  constructor(private httpClient: HttpClient) { }

  uploadSkinImage(skinImage: File, idChat: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('skinImage', skinImage);

    return this.httpClient.post(`${this.baseUrl}/${idChat}/`, formData);
  }
}
