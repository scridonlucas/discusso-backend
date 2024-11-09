import prisma from '../utils/prismaClient';
import bcrypt from 'bcrypt';
import { NewUser } from '../types/userTypes';

const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const getUserWithRole = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
    },
  });
};

const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

const addUser = async (newUser: NewUser) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

  const user = {
    ...newUser,
    birthDate: new Date(newUser.birthDate),
    password: passwordHash,
    roleId: 3,
  };

  const addedUser = await prisma.user.create({
    data: user,
  });

  return addedUser;
};

const deleteUser = async (id: number) => {
  const deletedUser = await prisma.user.delete({
    where: { id },
  });
  return deletedUser;
};

export default {
  getUsers,
  getUser,
  getUserWithRole,
  getUserByUsername,
  getUserByEmail,
  addUser,
  deleteUser,
};
