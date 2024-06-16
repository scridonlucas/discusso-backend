import { PrismaClient } from '@prisma/client';
import { NewDiscussion } from '../types/discussionType';

const prisma = new PrismaClient();

const addDiscussion = async (newDiscussion: NewDiscussion, userId: number) => {
  const addedDiscussion = await prisma.discussion.create({
    data: {
      ...newDiscussion,
      userId: userId,
    },
  });
  return addedDiscussion;
};

const getDiscussions = async (limit: number, offset: number) => {
  const discussions = await prisma.discussion.findMany({
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.discussion.count();

  return {
    discussions,
    total,
  };
};

export default {
  addDiscussion,
  getDiscussions,
};
