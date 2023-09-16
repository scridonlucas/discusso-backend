import { NewUser, User } from '../../types';
const users: User[] = [];

export const addUser = (newUser: NewUser): User => {
  const user: User = {
    id: newUser.username,
    ...newUser,
  };
  users.push(user);
  return user;
};
