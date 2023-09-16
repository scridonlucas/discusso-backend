import { NewUser } from '../../../types';

const toNewUserEntry = (object: unknown): NewUser => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrent or missing data!');
  }

  if (
    'firstName' in object &&
    'lastName' in object &&
    'username' in object &&
    'email' in object &&
    'gender' in object &&
    'birthDate' in object &&
    'password' in object &&
    'confirmPassword' in object &&

  ) {
    const newUser: NewUser = {
    }
    return newUser;
  }
    throw new Error('Some fields are missing!');

};
