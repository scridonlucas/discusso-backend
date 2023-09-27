import 'express-async-errors';
import bcrypt from 'bcrypt';
import { NewUser } from '../types/types';
import models from '../models';

const { User } = models;

const getUsers = async () => {
  const users = await User.findAll();
  return users;
};

const addUser = async (newUser: NewUser) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

  const user = {
    ...newUser,
    password: passwordHash,
  };

  console.log(user);

  const addedUser = await User.create(user);

  return addedUser;
};

export default {
  getUsers,
  addUser,
};
