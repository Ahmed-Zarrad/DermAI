
export class JwtResponse {

  token: string;
  type: string;
  username: string;
  authorities: string[];

  constructor(jwttoken: string, type: string, username: string, authorities: string[]) {

    this.token = jwttoken;
    this.type = type;
    this.username = username;
    this.authorities = authorities;
  }
}
