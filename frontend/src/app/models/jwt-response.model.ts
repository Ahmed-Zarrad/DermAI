
export class JwtResponse {

  token: string;
  type: string;
  username: string;
  authorities: string;
  currentUser: any;

  constructor(jwttoken: string, type: string, username: string, authorities: string, currentUser: any) {

    this.token = jwttoken;
    this.type = type;
    this.username = username;
    this.authorities = authorities;
    this.currentUser= currentUser;
  }
}
