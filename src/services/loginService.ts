import bcrypt from 'bcrypt';
import { UserAttributes } from '../types/userTypes';

const comparePasswords = async (
  user: UserAttributes | null,
  password: string
) => {
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);
  return passwordCorrect;
};

export default {
  comparePasswords,
};
