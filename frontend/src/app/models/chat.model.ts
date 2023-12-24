import {User} from "./user.model";
import {SkinResults} from "./skin-results.model";

export class Chat {
  id!: any;
  subject?:  any;
  type!: any;
  created!:  Date;
  users!: User[] ;
  skinResults!: SkinResults[] ;

}
