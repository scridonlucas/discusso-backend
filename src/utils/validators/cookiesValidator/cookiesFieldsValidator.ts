import typeValidators from '../typeValidators';
import { CustomTokenError } from '../../customErrors';

const tokenValidator = (input: unknown): string => {
  if (!typeValidators.isString(input)) {
    throw new CustomTokenError('Incorrect type');
  }
  return input;
};

export default {
  tokenValidator,
};
