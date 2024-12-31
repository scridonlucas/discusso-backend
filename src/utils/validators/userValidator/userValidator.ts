import { NewUser } from '../../../types/userTypes';
import fieldsValidator from './userFieldsValidator';

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
    const password = fieldsValidator.parsePassword(object.password);
    const confirmPassword = fieldsValidator.parsePassword(
      object.confirmPassword
    );

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    const newUser: NewUser = {
      firstName: fieldsValidator.parseName(object.firstName),
      lastName: fieldsValidator.parseName(object.lastName),
      username: fieldsValidator.parseUsername(object.username),
      status: 'ACTIVE',
      email: fieldsValidator.parseEmail(object.email),
      gender: fieldsValidator.parseGender(object.gender),
      birthDate: fieldsValidator.parseBirthDate(object.birthDate),
      password: password,
    };

    return newUser;
  }
  throw new Error('Some fields are missing!');
};

export default toNewUserEntry;
