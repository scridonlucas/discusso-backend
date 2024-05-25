export interface NewRegisteredUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: Gender;
  birthDate: string;
  password: string;
  confirmPassword: string;
}

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: Gender;
  birthDate: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export type NewUser = Omit<UserAttributes, 'id'>;

export type Gender = 'male' | 'female' | 'other';
