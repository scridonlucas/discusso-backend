import cookiesFieldsValidator from './cookiesFieldsValidator';
import { CustomTokenError } from '../../customErrors';
import { Cookie } from '../../../types/authTypes';

const toNewCookie = (object: unknown): Cookie => {
  if (!object || typeof object !== 'object') {
    throw new CustomTokenError('Missing cookies!');
  }
  if ('token' in object) {
    const newCookies: Cookie = {
      token: cookiesFieldsValidator.tokenValidator(object.token),
    };
    return newCookies;
  }
  throw new CustomTokenError('Token is missing!');
};

export default toNewCookie;
