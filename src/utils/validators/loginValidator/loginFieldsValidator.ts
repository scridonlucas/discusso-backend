import typeValidators from '../typeValidators';

const emailValidator = (input: unknown): string => {
  if (!typeValidators.isString(input)) {
    throw new Error('Incorrect type');
  }
  return input;
};

const passwordValidator = (input: unknown): string => {
  if (!typeValidators.isString(input)) {
    throw new Error('Incorrect type');
  }
  return input;
};

export default {
  emailValidator,
  passwordValidator,
};
