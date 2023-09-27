import 'express-async-errors';
import bcrypt from 'bcrypt';
import { NewUser } from '../types/types';
import models from '../models';

const { User } = models;

const getUsers = async () => {
  const users = await User.findAll();
  return users;
};

const getUser = async (id: number) => {
  const user = await User.findByPk(id);
  return user;
};

const addUser = async (newUser: NewUser) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

  const user = {
    ...newUser,
    password: passwordHash,
  };

  const addedUser = await User.create(user);

  return addedUser;
};

const deleteUser = async (id: number) => {
  const deletedUser = await User.destroy({
    where: {
      id: id,
    },
  });

  return deletedUser;
};

export default {
  getUsers,
  getUser,
  addUser,
  deleteUser,
};
