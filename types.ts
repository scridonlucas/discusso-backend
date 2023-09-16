export interface NewUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: Gender;
  birthDate: string;
  password: string;
  confirmPassword: string;
}

type Gender = 'male' | 'female' | 'other';
