import { NewUser } from '../../../../types';

import { parseName, parseUsername } from './fieldsValidator';

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
    'confirmPassword' in object
  ) {
    const newUser: NewUser = {
      firstName: parseName(object.firstName),
      lastName: parseName(object.lastName),
      username: parseUsername(object.username),
      email: 's',
      gender: 'male',
      birthDate: 's',
      password: 'sa',
      confirmPassword: 'sa',
    };
    return newUser;
  }
  throw new Error('Some fields are missing!');
};

export default toNewUserEntry;
