import prisma from '../utils/prismaClient';
import { NewDiscussion, UpdatedDiscussion } from '../types/discussionType';
import { CustomDiscussionError } from '../utils/customErrors';
import { Prisma } from '@prisma/client';
import { reportReason } from '../types/discussionType';
import { createNotification } from './notificationService';
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

const getDiscussionsCount = async (startDate?: string, endDate?: string) => {
  const whereClause: Prisma.DiscussionWhereInput = {
    createdAt: {
      ...(startDate ? { gte: new Date(startDate) } : {}),
      ...(endDate ? { lte: new Date(endDate) } : {}),
    },
    isDeleted: false,
  };

  const discussionCount = await prisma.discussion.count({
    where: whereClause,
  });

  return discussionCount;
};
const getDiscussions = async (
  userId: number,
  limit: number,
  cursor: number | null,
  communityId: number | null = null,
  feedType: 'explore' | 'following' = 'explore',
  sort: 'recent' | 'oldest' | 'most_liked' | 'most_commented' = 'recent',
  dateRange:
    | 'all'
    | 'last_hour'
    | 'last_day'
    | 'last_week'
    | 'last_month' = 'all',
  saved: boolean,
  search: string = ''
) => {
  const orderBy: Prisma.DiscussionOrderByWithRelationInput =
    getOrderByOption(sort);

  const where: Prisma.DiscussionWhereInput = {
    ...getTimeFilterCondition(dateRange),
    ...getFeedCondition(feedType, userId),
    isDeleted: false,
    communityId: communityId === null ? undefined : communityId,
    ...(saved ? { bookmarks: { some: { userId } } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const discussions = await prisma.discussion.findMany({
    take: limit + 1,
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

  const total = await prisma.discussion.count({ where });

  const hasMore = discussions.length > limit;
  const results = hasMore ? discussions.slice(0, limit) : discussions;

  return {
    discussions: results,
    nextCursor: hasMore ? results[results.length - 1].id : null,
    total,
  };
};

const getTrendingDiscussions = async () => {
  const discussions = await prisma.discussion.findMany({
    take: 15,
    orderBy: {
      trendingScore: 'desc',
    },
    where: { isDeleted: false },
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

  return { discussions };
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
    take: limit + 1,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.discussion.count({
    where: { userId },
  });

  const hasMore = discussions.length > limit;
  const results = hasMore ? discussions.slice(0, limit) : discussions;

  return {
    discussions: results,
    nextCursor: hasMore ? results[results.length - 1].id : null,
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
      comments: {
        include: {
          user: { select: { id: true, username: true } },
        },
      },
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
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!discussion) {
    throw new CustomDiscussionError('Discussion not found');
  }

  if (discussion.isDeleted) {
    throw new CustomDiscussionError('This discussion has been deleted.');
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

const softDeleteDiscussion = async (discussionId: number, _userId: number) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new CustomDiscussionError('Discussion not found');
  }

  await prisma.discussion.update({
    where: { id: discussionId },
    data: { isDeleted: true },
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
    include: { user: { select: { id: true, username: true } } },
  });

  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
    select: { userId: true },
  });

  if (!discussion) {
    throw new CustomDiscussionError('Discussion not found');
  }

  await createNotification(
    discussion.userId,
    'LIKE',
    `User ${like.user.username} liked your discussion #${discussionId}`
  );

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
    include: { user: { select: { id: true, username: true } } },
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

// comment functionality
const addComment = async (
  userId: number,
  discussionId: number,
  content: string
) => {
  const comment = await prisma.comment.create({
    data: {
      userId,
      discussionId,
      content,
    },
    include: {
      user: { select: { id: true, username: true } },
      _count: { select: { likes: true } },
    },
  });

  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
    select: { userId: true },
  });

  if (!discussion) {
    throw new CustomDiscussionError('Discussion not found');
  }

  await createNotification(
    discussion.userId,
    'COMMENT',
    `User ${comment.user.username} commented on your discussion #${discussionId}`
  );

  return comment;
};

async function getComments(
  discussionId: number,
  limit: number,
  cursor: number | null,
  sort: 'recent' | 'oldest' | 'most_liked' = 'recent'
) {
  const orderBy: Prisma.CommentOrderByWithRelationInput =
    getOrderByOptionForComments(sort);

  const comments = await prisma.comment.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy,
    where: {
      discussionId,
      isDeleted: false,
    },
    include: {
      user: { select: { id: true, username: true } },
      likes: {
        select: {
          user: { select: { id: true, username: true } },
        },
      },
      _count: { select: { likes: true } },
    },
  });

  const hasMore = comments.length > limit;
  const results = hasMore ? comments.slice(0, limit) : comments;
  const nextCursor = hasMore ? comments[comments.length - 1].id : null;

  const totalCount = await prisma.comment.count({
    where: { discussionId },
  });

  return { comments: results, totalCount, nextCursor };
}

// report logic
const addDiscussionReport = async (
  discussionId: number,
  userId: number,
  reason: reportReason
) => {
  const existingPendingReport = await prisma.discussionReport.findFirst({
    where: {
      discussionId,
      userId,
      status: 'PENDING',
    },
  });

  if (existingPendingReport) {
    throw new CustomDiscussionError(
      `You have already reported this discussion and it is currently under review.`
    );
  }

  const newReport = await prisma.discussionReport.create({
    data: {
      discussionId,
      userId,
      reason,
    },
  });

  return newReport;
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

const getOrderByOptionForComments = (
  sort: 'recent' | 'oldest' | 'most_liked'
): Prisma.CommentOrderByWithRelationInput => {
  switch (sort) {
    case 'recent':
      return { createdAt: 'desc' };
    case 'oldest':
      return { createdAt: 'asc' };
    case 'most_liked':
      return { likes: { _count: 'desc' } };
    default:
      return { createdAt: 'desc' };
  }
};

function getTimeFilterCondition(
  timeFilter: 'last_hour' | 'last_day' | 'last_week' | 'last_month' | 'all'
): Prisma.DiscussionWhereInput {
  const now = new Date();

  if (!timeFilter || timeFilter === 'all') return {};

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
    default:
      return {};
  }
}

const getFeedCondition = (
  feedType: 'explore' | 'following',
  userId: number
): Prisma.DiscussionWhereInput => {
  if (feedType === 'explore') return {};

  return {
    OR: [
      { community: { followers: { some: { userId } } } },
      { user: { followers: { some: { followerId: userId } } } },
    ],
  };
};
//

export default {
  addDiscussion,
  getDiscussions,
  getTrendingDiscussions,
  getDiscussionsByUser,
  getDiscussionsByCommunity,
  getDiscussionById,
  deleteDiscussion,
  softDeleteDiscussion,
  updateDiscussion,
  addLike,
  deleteLike,
  getTotalLikesForDiscussion,
  getUsersWhoLikedDiscussion,
  hasUserLikedDiscussion,
  addBookmark,
  removeBookmark,
  addComment,
  getComments,
  addDiscussionReport,
  getDiscussionsCount,
};
