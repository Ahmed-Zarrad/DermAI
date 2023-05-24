export class User {
  username!: string;
  passwordHash: string = "";
  accessToken!: string;
  refreshToken!: string;
}
