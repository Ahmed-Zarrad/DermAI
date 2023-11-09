import {Speciality} from "./speciality";

export class User {
  username!: string;
  password!: string;
  confirmPassword!: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthday?: Date;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: number;
  speciality?: Speciality
  photo?: string;
  publicId?: string;


  constructor( username: string, password: string, confirmPassword: string, firstName: string, lastName: string, email: string, birthday: Date, phone: string, country: string, city: string, address: string,
              postalCode: number, speciality: Speciality, photo: string, publicId: string) {

    this.username = username;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.birthday = birthday;
    this.phone = phone;
    this.country = country;
    this.city = city;
    this.address = address;
    this.postalCode = postalCode;
    this.speciality = speciality;
    this.photo = photo;
    this.publicId = publicId;

  }
}
