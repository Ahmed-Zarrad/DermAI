import {User} from "./user.model";
export class SkinResults {
  image!: string;
  publicId!: string;
  skinType!: string;
  probability!: number;
  symptoms!: any;
  treatments!: any;
  howCommon!: string;
  duration!: string;
  created!: Date;
  user! : User;
}

