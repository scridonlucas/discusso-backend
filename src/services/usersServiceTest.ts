import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NewUser } from '../types/userTypes';

const prisma = new PrismaClient();

const addUser = async (newUser: NewUser) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

  const user = {
    ...newUser,
    birthDate: new Date(newUser.birthDate),
    password: passwordHash,
  };

  const addedUser = await prisma.user.create({
    data: user,
  });

  return addedUser;
};

export default {
  addUser,
};
