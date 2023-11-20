import typeValidators from '../typeValidators';

const tokenValidator = (input: unknown): string => {
  if (!typeValidators.isString(input)) {
    throw new Error('Incorrect type');
  }
  return input;
};

export default {
  tokenValidator,
};
