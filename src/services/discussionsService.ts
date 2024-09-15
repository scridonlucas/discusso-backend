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

const getDiscussionsByUser = async (
  userId: number,
  limit: number,
  offset: number
) => {
  const discussions = await prisma.discussion.findMany({
    where: { userId },
    skip: offset,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.discussion.count({
    where: { userId },
  });

  return { discussions, total };
};

const getDiscussionsByCommunity = async (
  communityId: number,
  limit: number,
  offset: number
) => {
  const discussions = await prisma.discussion.findMany({
    where: { communityId },
    skip: offset,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.discussion.count({
    where: { communityId },
  });

  return { discussions, total };
};

const getDiscussionById = async (discussionId: number) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
    include: {
      user: true,
      community: true,
      comments: true,
    },
  });

  if (!discussion) {
    throw new CustomDiscussionError('Discussion not found');
  }

  return discussion;
};

const deleteDiscussion = async (discussionId: number, userId: number) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new CustomDiscussionError('Discussion not found');
  }

  if (discussion.userId !== userId) {
    throw new CustomDiscussionError('Not authorized to delete this discussion');
  }

  await prisma.discussion.delete({
    where: { id: discussionId },
  });

  return { message: 'Discussion deleted successfully' };
};

const updateDiscussion = async (discussionId: number, userId: number) => {};

// likes service
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
    throw new CustomDiscussionError(
      'User has not liked this discussion or not authorized to remove this like'
    );
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
  getDiscussionsByUser,
  getDiscussionsByCommunity,
  getDiscussionById,
  deleteDiscussion,
  updateDiscussion,
  addLike,
  deleteLike,
  getTotalLikesForDiscussion,
  getUsersWhoLikedDiscussion,
  hasUserLikedDiscussion,
};
