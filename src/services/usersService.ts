import { NewUser, User } from '../types/types';
const users: User[] = [];

const getUsers = (): User[] => {
  return users;
};
const addUser = (newUser: NewUser): User => {
  const user: User = {
    id: newUser.username,
    ...newUser,
  };
  users.push(user);
  return user;
};

export default {
  getUsers,
  addUser,
};
