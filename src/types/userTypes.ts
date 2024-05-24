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

export interface BaseUser {
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

export type NewUser = Omit<BaseUser, 'id'>;

export type Gender = 'male' | 'female' | 'other';
