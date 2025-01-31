import prisma from '../utils/prismaClient';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NewUser } from '../types/userTypes';

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      gender: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });
  return users;
};

const getUser = async (id: number, privateData: boolean) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      roleId: true,
      firstName: true,
      lastName: true,
      username: true,
      email: privateData,
      gender: true,
      status: true,
      birthDate: privateData,
      createdAt: true,
      updatedAt: true,
      followedCommunities: true,
      role: true,
      followers: true,
      following: true,
      discussions: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      notifications: true,
      bookmarks: true,
      _count: {
        select: {
          followedCommunities: true,
          bookmarks: true,
          discussions: true,
          comments: true,
          notifications: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  return user;
};

const getUserCount = async (
  status?: 'ACTIVE' | 'BANNED',
  startDate?: string,
  endDate?: string
) => {
  const whereClause: Prisma.UserWhereInput = {
    status: status,
    createdAt: {
      ...(startDate ? { gte: new Date(startDate) } : {}),
      ...(endDate ? { lte: new Date(endDate) } : {}),
    },
  };
  const userCount = await prisma.user.count({
    where: whereClause,
  });
  return userCount;
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
    roleId: 2,
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

const updateUserStatus = async (id: number, status: 'ACTIVE' | 'BANNED') => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
  });
  return updatedUser;
};

const updateUserRole = async (id: number, roleName: 'USER' | 'ADMIN') => {
  const role = await prisma.role.findUnique({
    where: { roleName: roleName },
  });

  if (!role) {
    throw new Error(`No role found with the name "${roleName}"`);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { roleId: role.id },
  });

  return updatedUser;
};

const followUser = async (followerId: number, followedId: number) => {
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followedId,
    },
  });

  if (existingFollow) {
    throw new Error('User already following this user');
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followedId,
    },
  });

  return follow;
};

const unfollowUser = async (followerId: number, followedId: number) => {
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followedId,
    },
  });

  if (!existingFollow) {
    throw new Error('User is not following this user');
  }

  const unfollow = await prisma.follow.delete({
    where: {
      followerId_followedId: {
        followerId,
        followedId,
      },
    },
  });

  return unfollow;
};

const getUsersWithMostDiscussions = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      _count: {
        select: {
          discussions: true,
        },
      },
    },
    orderBy: {
      discussions: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  return users;
};

const getMostFollowedUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
    orderBy: {
      followers: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  return users;
};

export default {
  getUsers,
  getUser,
  getUserWithRole,
  getUserByUsername,
  getUserByEmail,
  addUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  getUserCount,
  followUser,
  unfollowUser,
  getUsersWithMostDiscussions,
  getMostFollowedUsers,
};
