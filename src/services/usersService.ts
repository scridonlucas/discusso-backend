import 'express-async-errors';
import { NewUser } from '../types/types';
import models from '../models';

const { User } = models;

const getUsers = async () => {
  const users = await User.findAll();
  return users;
};
const addUser = async (newUser: NewUser) => {
  const user = {
    id: 1,
    ...newUser,
  };
  const addedUser = await User.create(user);

  return addedUser;
};
export default {
  getUsers,
  addUser,
};
