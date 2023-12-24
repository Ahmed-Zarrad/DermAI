import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtResponse } from '../../models/jwt-response.model';
import { User } from '../../models/user.model';
import {Role} from "../../models/role";
import {Status} from "../../models/status";



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private UserURL = 'http://localhost:3001/api/v1/users';

  constructor(private userhttp: HttpClient) {
  }

  addUser(user: User | undefined, role: Role) {
    return this.userhttp.post<JwtResponse>(`${this.UserURL}/${role}`, user, httpOptions)
      .pipe(data => {
        return data;
      });
  }
  uploadPhoto(photo: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('photo', photo);

    return this.userhttp.post(`${this.UserURL}/photo`, formData);
  }
  getByRoleUser(role: any): Observable<any> {
    return this.userhttp.get(`${this.UserURL}/byRole/${role}`);
  }
  updateStaus(status: Status): Observable<any> {
    return this.userhttp.put(`${this.UserURL}/updateStatus`,{ status }, httpOptions);
  }

}
