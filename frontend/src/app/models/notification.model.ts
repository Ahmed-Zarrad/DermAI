import {User} from "./user.model";

export class Notification {
  id!: any;
  title!:  any;
  description?: any;
  image?: any;
  unread!: boolean;
  created!:  Date;
  user!: User[] ;
}
