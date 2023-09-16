import { isString } from '../typeValidators';

export const parseName = (name: unknown): string => {
  if (!isString(name)) {
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

export const parseUsername = (username: unknown): string => {
  if (!isString(username)) {
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
