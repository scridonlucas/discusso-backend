import { Gender } from '../../../types/types';
import typeValidators from '../typeValidators';

const parseName = (name: unknown): string => {
  if (!typeValidators.isString(name)) {
    throw new Error('Incorrect first name type');
  }
  if (!/^[A-Za-z]+$/.test(name)) {
    throw new Error('Name should only contain letters (alphabetic characters)');
  }
  if (name.length < 3 || name.length > 30) {
    throw new Error(
      'Both the first and last names should be between 3 and 30 characters in length."'
    );
  }
  return name;
};

const parseUsername = (username: unknown): string => {
  if (!typeValidators.isString(username)) {
    throw new Error('Incorrect username type');
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    throw new Error('Username can only contain letters and numbers');
  }
  if (username.length < 3 || username.length > 16) {
    throw new Error(
      'Both the first and last names should be between 3 and 16 characters in length."'
    );
  }
  return username;
};

const parseEmail = (email: unknown): string => {
  if (!typeValidators.isString(email)) {
    throw new Error('Incorrect email type');
  }
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
    throw new Error('Invalid email address format');
  }
  return email;
};

const parseGender = (gender: unknown): Gender => {
  if (!typeValidators.isString(gender) || !typeValidators.isGender(gender)) {
    throw new Error('Incorrect gender type/format');
  }
  return gender;
};

const parseBirthDate = (birthDate: unknown): string => {
  if (
    !typeValidators.isString(birthDate) ||
    !typeValidators.isDate(birthDate)
  ) {
    throw new Error('Incorrect date format');
  }
  return birthDate;
};

const parsePassword = (password: unknown): string => {
  if (!typeValidators.isString(password)) {
    throw new Error('Incorrect password type');
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new Error(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    );
  }
  if (password.length < 8 || password.length > 16) {
    throw new Error(
      'Password should be between 8 and 16 characters in length."'
    );
  }
  return password;
};

export default {
  parseName,
  parseUsername,
  parseEmail,
  parseGender,
  parseBirthDate,
  parsePassword,
};
