import { LoginUser } from '../../../types/types';
import loginFieldsValidator from './loginFieldsValidator';

const toNewLoginEntry = (object: unknown): LoginUser => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrent or missing data!');
  }

  if ('email' in object && 'password' in object) {
    const newLoginEntry: LoginUser = {
      email: loginFieldsValidator.emailValidator(object.email),
      password: loginFieldsValidator.passwordValidator(object.password),
    };
    return newLoginEntry;
  }
  throw new Error('Some fields are missing');
};

export default toNewLoginEntry;
