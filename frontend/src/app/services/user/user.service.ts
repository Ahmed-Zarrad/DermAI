import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { JwtResponse } from '../../models/jwt-response.model';
import { User } from '../../models/user.model';
import {Role} from "../../models/role";



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private addUserURL = 'http://localhost:3001/api/v1/users';
  private uploadPhotoUrl = 'http://localhost:3001/api/v1/users/photo'
  deleteUserURL = 'http://localhost:9091/SpringMVC/servlet';
  updateUserURL = 'http://localhost:9091/SpringMVC/servlet';
  getAllUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-all-user';
  getByIdUserURL = 'http://localhost:9091/SpringMVC/servlet';
  getByPointUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-point';
  getByUsernameUserURL = 'http://localhost:9091/SpringMVC/servlet';
  getByStateUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-state';
  getByAdressUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-adress';
  getByDateUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-date';
  getBySexeUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-sexe';
  getByEmailUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-email';
  getBySalaireUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-salaire';
  getBySalairegtUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-salairegt';
  getBySalaireltUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-salairelt';
  getByRoleUserURL = 'http://localhost:9091/SpringMVC/servlet/retrieve-user-by-role';
  getAllNamesUserURL = 'http://localhost:9091/SpringMVC/servlet/users-names';
  getActivateUserURL = 'http://localhost:9091/SpringMVC/servlet/activate-user';
  getDesactivateUserURL = 'http://localhost:9091/SpringMVC/servlet/desactivate-User';
  getCountUserURL = 'http://localhost:9091/SpringMVC/servlet/count-user';
  findActivateUserURL = 'http://localhost:9091/SpringMVC/servlet/findActivatedUser';
  getDisabledUserURL = 'http://localhost:9091/SpringMVC/servlet/findDisabledUser';
  getMoySalaireUserURL = 'http://localhost:9091/SpringMVC/servlet/moy-salaire';
  getSommeSalaireUserURL = 'http://localhost:9091/SpringMVC/servlet/somme-salaire';
  getMaxSalaireUserURL = 'http://localhost:9091/SpringMVC/servlet/max-salaire';
  getMinAgeUserURL = 'http://localhost:9091/SpringMVC/servlet/min-age';

  public getImage = new Subject<string>();

  constructor(private userhttp: HttpClient, private router: Router) {
  }

  addUser(user: User, role: Role) {
    return this.userhttp.post<JwtResponse>(`${this.addUserURL}/${role}`, user, httpOptions)
      .pipe(data => {
        return data;
      });
  }
  uploadPhoto(photo: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('photo', photo);

    return this.userhttp.post(this.uploadPhotoUrl, formData);
  }

  deleteUser(idUser: any): Observable<any> {
    return this.userhttp.delete(`${this.deleteUserURL}/delete-user/${idUser}`, { responseType: 'text' });
  }



  getAllUser(): Observable<any> {
    return this.userhttp.get(this.getAllUserURL);
  }

  getByIdUser(idUser: any): Observable<any> {
    return this.userhttp.get(`${this.getByIdUserURL}/retrieve-user-by-id/${idUser}`);
  }

  getByPointUser(point: number): Observable<any> {
    return this.userhttp.get(this.getByPointUserURL);
  }

  getByUsernameUser(username: string): Observable<any> {
    return this.userhttp.get(`${this.getByUsernameUserURL}/retrieve-user-by-username/${username}`);
  }

  getByStateUser(state: boolean): Observable<any> {
    return this.userhttp.get(this.getByStateUserURL);
  }

  getByAdressUser(adress: string): Observable<any> {
    return this.userhttp.get(this.getByAdressUserURL);
  }

  getByDateUser(date: Date): Observable<any> {
    return this.userhttp.get(this.getByDateUserURL);
  }

  getBySexeUser(sexe: string): Observable<any> {
    return this.userhttp.get(this.getBySexeUserURL);
  }

  getByEmailUser(email: string): Observable<any> {
    return this.userhttp.get(this.getByEmailUserURL);
  }

  getBySalaireUser(salaire: number): Observable<any> {
    return this.userhttp.get(this.getBySalaireUserURL);
  }

  getBySalairegtUser(salaire: number): Observable<any> {
    return this.userhttp.get(this.getBySalairegtUserURL);
  }

  getBySalaireltUser(salaire: string): Observable<any> {
    return this.userhttp.get(this.getBySalaireltUserURL);
  }



  getAllNamesUser(): Observable<any> {
    return this.userhttp.get(this.getAllNamesUserURL);
  }

  getActivateUser(): Observable<any> {
    return this.userhttp.get(this.getActivateUserURL);
  }

  getDesactivateUser(): Observable<any> {
    return this.userhttp.get(this.getDesactivateUserURL);
  }

  getCountUser(): Observable<any> {
    return this.userhttp.get(this.getCountUserURL);
  }

  findActivateUser(): Observable<any> {
    return this.userhttp.get(this.findActivateUserURL);
  }

  getDisabledUser(): Observable<any> {
    return this.userhttp.get(this.getDisabledUserURL);
  }

  getMoySalaireUser(): Observable<any> {
    return this.userhttp.get(this.getMoySalaireUserURL);
  }

  getSommeSalaireUser(): Observable<any> {
    return this.userhttp.get(this.getSommeSalaireUserURL);
  }

  getMaxSalaireUser(): Observable<any> {
    return this.userhttp.get(this.getMaxSalaireUserURL);
  }

  getMinAgeUser(): Observable<any> {
    return this.userhttp.get(this.getMinAgeUserURL);
  }

  // tslint:disable-next-line:typedef
  forgotPassword(email: string) {
    return this.userhttp.get('http://localhost:9091/SpringMVC/servlet/sendme/' + email);
  }

  // tslint:disable-next-line:typedef
  updatePassword(email: string, password: string, confirmPassword: string) {
    // tslint:disable-next-line:max-line-length
    return this.userhttp.put('http://localhost:9091/SpringMVC/servlet/updatepassword/' + email + '/' + password + '/' + confirmPassword, { responseType: 'text' });
  }
}
