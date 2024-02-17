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

  private UserURL = 'http://localhost:3001/api/v1';

  constructor(private userhttp: HttpClient) {
  }

  addUser(user: User | undefined, role: Role) {
    return this.userhttp.post<JwtResponse>(`${this.UserURL}/signup/${role}`, user, httpOptions)
      .pipe(data => {
        return data;
      });
  }
  uploadPhoto(photo: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('photo', photo);

    return this.userhttp.post(`${this.UserURL}/signup/photo`, formData);
  }
  getByRoleUser(role: any): Observable<any> {
    return this.userhttp.get(`${this.UserURL}/users/byRole/${role}`);
  }
  updateStaus(status: Status): Observable<any> {
    return this.userhttp.put(`${this.UserURL}/users/updateStatus`,{ status }, httpOptions);
  }
  ajouterUser(user: User): Observable<any> {
    return this.userhttp.post<JwtResponse>(this.UserURL, user).pipe(data => {
      return data;
    })
  }
  deleteUser(idUser: any): Observable<any> {
    return this.userhttp.delete(`${this.UserURL}/delete-user/${idUser}`, { responseType: 'text' });
  }
  updateUser(user: User): Observable<any> {
    return this.userhttp.put<JwtResponse>(`${this.UserURL}`, user, httpOptions)
  }
  getAllUser(): Observable<any> {
    return this.userhttp.get(`${this.UserURL}/users`);
  }
  getByUsernameUser(username: string): Observable<any> {
    return this.userhttp.get(`${this.UserURL}/retrieve-user-by-username/${username}`);
  }
  updatePassword(email: string, password: string, confirmPassword: string) {
    return this.userhttp.put('http://localhost:9091/SpringMVC/servlet/updatepassword/' + email + '/' + password + '/' + confirmPassword, { responseType: 'text' });
  }
}
