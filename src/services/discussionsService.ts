import prisma from '../utils/prismaClient';
import { NewDiscussion } from '../types/discussionType';
import { CustomDiscussionError } from '../utils/customErrors';

const addDiscussion = async (newDiscussion: NewDiscussion, userId: number) => {
  const community = await prisma.community.findUnique({
    where: { id: newDiscussion.communityId },
  });

  if (!community) {
    throw new CustomDiscussionError('Community not found');
  }

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

const addLike = async (userId: number, discussionId: number) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
  });

  if (existingLike) {
    throw new CustomDiscussionError('User has already liked this discussion');
  }

  const like = await prisma.like.create({
    data: {
      userId,
      discussionId,
    },
  });

  return like;
};

const deleteLike = async (userId: number, discussionId: number) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
  });

  if (!existingLike) {
    throw new CustomDiscussionError('User has not liked this discussion');
  }
  const removedLike = await prisma.like.delete({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
  });

  return removedLike;
};

export const getTotalLikesForDiscussion = async (discussionId: number) => {
  const totalLikes = await prisma.like.count({
    where: { discussionId },
  });
  return totalLikes;
};

export const getUsersWhoLikedDiscussion = async (discussionId: number) => {
  const users = await prisma.like.findMany({
    where: { discussionId },
    include: {
      user: true,
    },
  });
  const usersList = users.map((user) => user.user);

  return usersList;
};

export const hasUserLikedDiscussion = async (
  userId: number,
  discussionId: number
) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
  });

  if (existingLike === null) {
    return false;
  } else {
    return true;
  }
};

export default {
  addDiscussion,
  getDiscussions,
  addLike,
  deleteLike,
  getTotalLikesForDiscussion,
  getUsersWhoLikedDiscussion,
  hasUserLikedDiscussion,
};
