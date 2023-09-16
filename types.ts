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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: Gender;
  birthDate: string;
  password: string;
}

export type NewUser = Omit<User, 'id'>;

export type Gender = 'male' | 'female' | 'other';
