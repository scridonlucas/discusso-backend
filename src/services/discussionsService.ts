import prisma from '../utils/prismaClient';
import { NewDiscussion, UpdatedDiscussion } from '../types/discussionType';
import { CustomDiscussionError } from '../utils/customErrors';
import { Prisma } from '@prisma/client';
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
const getDiscussions = async (
  limit: number,
  cursor: number | null,
  sort: 'recent' | 'oldest' | 'most_liked' | 'most_commented' = 'recent',
  dateRange: 'last_hour' | 'last_day' | 'last_week' | 'last_month' | null = null
) => {
  const orderBy: Prisma.DiscussionOrderByWithRelationInput =
    getOrderByOption(sort);
  const where = getTimeFilterCondition(dateRange);
  const discussions = await prisma.discussion.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy,
    where,
    include: {
      user: { select: { id: true, username: true } },
      community: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
      likes: {
        select: {
          user: { select: { id: true, username: true } },
        },
      },
      bookmarks: {
        select: {
          user: { select: { id: true, username: true } },
        },
      },
    },
  });

  const total = await prisma.discussion.count();

  return {
    discussions,
    nextCursor:
      discussions.length > 0 ? discussions[discussions.length - 1].id : null,
    total,
  };
};

const getTrendingDiscussions = async (
  limit: number,
  cursor: number | null,
  dateRange: 'last_hour' | 'last_day' | 'last_week' | 'last_month' | null = null
) => {
  const where = getTimeFilterCondition(dateRange);
  const discussions = await prisma.discussion.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    where,
    include: {
      user: { select: { id: true, username: true } },
      community: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
      likes: {
        select: {
          user: { select: { id: true, username: true } },
        },
      },
      bookmarks: {
        select: {
          user: { select: { id: true, username: true } },
        },
      },
    },
  });

  const total = await prisma.discussion.count();

  return {
    discussions,
    nextCursor:
      discussions.length > 0 ? discussions[discussions.length - 1].id : null,
    total,
  };
};

const getDiscussionsByUser = async (
  userId: number,
  limit: number,
  cursor: number | null
) => {
  const discussions = await prisma.discussion.findMany({
    where: { userId },
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.discussion.count({
    where: { userId },
  });

  return {
    discussions,
    nextCursor:
      discussions.length > 0 ? discussions[discussions.length - 1].id : null,
    total,
  };
};

const getDiscussionsByCommunity = async (
  communityId: number,
  limit: number,
  cursor: number | null
) => {
  const discussions = await prisma.discussion.findMany({
    where: { communityId },
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.discussion.count({
    where: { communityId },
  });

  return {
    discussions,
    nextCursor:
      discussions.length > 0 ? discussions[discussions.length - 1].id : null,
    total,
  };
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

const deleteDiscussion = async (discussionId: number, _userId: number) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new CustomDiscussionError('Discussion not found');
  }

  await prisma.discussion.delete({
    where: { id: discussionId },
  });
  return { message: 'Discussion deleted successfully' };
};

const updateDiscussion = async (
  _userId: number,
  discussionId: number,
  discussionUpdateData: UpdatedDiscussion
) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new CustomDiscussionError('Discussion not found');
  }

  const updatedDiscussion = await prisma.discussion.update({
    where: { id: discussionId },
    data: {
      ...(discussionUpdateData.title && { title: discussionUpdateData.title }),
      ...(discussionUpdateData.content && {
        content: discussionUpdateData.content,
      }),
    },
  });

  return updatedDiscussion;
};

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
    throw new CustomDiscussionError('User has not liked this discussion.');
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

// bookmark / save service
const addBookmark = async (userId: number, discussionId: number) => {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
  });

  if (existingBookmark) {
    throw new CustomDiscussionError('User has already saved this discussion');
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      userId,
      discussionId,
    },
  });

  return bookmark;
};

const removeBookmark = async (userId: number, discussionId: number) => {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
  });

  if (!existingBookmark) {
    throw new CustomDiscussionError('Bookmark does not exist');
  }

  const bookmark = await prisma.bookmark.delete({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
  });

  return bookmark;
};

// Helper functions
const getOrderByOption = (
  sort: 'recent' | 'oldest' | 'most_liked' | 'most_commented'
): Prisma.DiscussionOrderByWithRelationInput => {
  switch (sort) {
    case 'recent':
      return { createdAt: 'desc' };
    case 'oldest':
      return { createdAt: 'asc' };
    case 'most_liked':
      return { likes: { _count: 'desc' } };
    case 'most_commented':
      return { comments: { _count: 'desc' } };
    default:
      return { createdAt: 'desc' };
  }
};

function getTimeFilterCondition(
  timeFilter: 'last_hour' | 'last_day' | 'last_week' | 'last_month' | null
) {
  const now = new Date();
  if (!timeFilter) return {};

  switch (timeFilter) {
    case 'last_hour':
      now.setHours(now.getHours() - 1);
      return { createdAt: { gte: now } };
    case 'last_day':
      now.setDate(now.getDate() - 1);
      return { createdAt: { gte: now } };
    case 'last_week':
      now.setDate(now.getDate() - 7);
      return { createdAt: { gte: now } };
    case 'last_month':
      now.setMonth(now.getMonth() - 1);
      return { createdAt: { gte: now } };
  }
}
//

export default {
  addDiscussion,
  getDiscussions,
  getTrendingDiscussions,
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
  addBookmark,
  removeBookmark,
};
