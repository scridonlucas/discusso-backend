import bcrypt from 'bcrypt';
import { BaseUser } from '../types/types';

const comparePasswords = async (user: BaseUser | null, password: string) => {
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);
  return passwordCorrect;
};

export default {
  comparePasswords,
};
