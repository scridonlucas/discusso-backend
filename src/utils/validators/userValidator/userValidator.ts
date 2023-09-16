import { NewUser } from '../../../../types';

import {
  parseName,
  parseUsername,
  parseEmail,
  parseGender,
  parseBirthDate,
  parsePassword,
} from './fieldsValidator';

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
    const password = parsePassword(object.password);
    const confirmPassword = parsePassword(object.confirmPassword);

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const newUser: NewUser = {
      firstName: parseName(object.firstName),
      lastName: parseName(object.lastName),
      username: parseUsername(object.username),
      email: parseEmail(object.email),
      gender: parseGender(object.gender),
      birthDate: parseBirthDate(object.birthDate),
      password: password,
    };

    return newUser;
  }
  throw new Error('Some fields are missing!');
};

export default toNewUserEntry;
