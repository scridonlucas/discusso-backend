import { Cookie } from '../../../types/types';
import cookiesFieldsValidator from './cookiesFieldsValidator';

const cookiesValidator = (object: unknown): Cookie => {
  if (!object || typeof object !== 'object') {
    throw new Error('Missing token!');
  }
  if ('token' in object) {
    const newCookies: Cookie = {
      token: cookiesFieldsValidator.tokenValidator(object.token),
    };
    return newCookies;
  }
  throw new Error('Some fields are missing');
};

export default cookiesValidator;
