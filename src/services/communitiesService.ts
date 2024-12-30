import prisma from '../utils/prismaClient';
import { Prisma } from '@prisma/client';
import { CustomCommunityError } from '../utils/customErrors';

const getCommunities = async () => {
  const communities = await prisma.community.findMany({
    where: { isDeleted: false },
    include: {
      followers: { select: { id: true } },
      _count: {
        select: {
          discussions: true,
          followers: true,
        },
      },
    },
  });
  return communities;
};

const getCommunityById = async (communityId: number) => {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
    include: {
      followers: { select: { id: true } },
      _count: {
        select: {
          discussions: true,
          followers: true,
        },
      },
    },
  });
  return community;
};

const addCommunity = async (
  communityName: string,
  userId: number,
  description?: string
) => {
  const community = await prisma.community.create({
    data: {
      name: communityName,
      userId: userId,
      description,
    },
  });
  return community;
};

const getCommunitiesWithDiscussionCounts = async () => {
  const count = await prisma.community.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          discussions: true,
        },
      },
    },
    take: 5,
  });
  return count;
};

const updateCommunity = async (
  communityId: number,
  data: Partial<Prisma.CommunityUpdateInput>
) => {
  const community = await prisma.community.update({
    where: { id: communityId },
    data: data,
  });
  return community;
};

const followCommunity = async (userId: number, communityId: number) => {
  const existingFollow = await prisma.userCommunity.findFirst({
    where: {
      userId,
      communityId,
    },
  });

  if (existingFollow) {
    throw new CustomCommunityError('User already following this community');
  }

  const follow = await prisma.userCommunity.create({
    data: {
      userId,
      communityId,
    },
  });

  return follow;
};

const unfollowCommunity = async (userId: number, communityId: number) => {
  const existingFollow = await prisma.userCommunity.findFirst({
    where: {
      userId,
      communityId,
    },
  });

  if (!existingFollow) {
    throw new CustomCommunityError('User is not following this community');
  }

  const unfollow = await prisma.userCommunity.delete({
    where: {
      userId_communityId: {
        userId,
        communityId,
      },
    },
  });

  return unfollow;
};

export default {
  getCommunities,
  addCommunity,
  getCommunityById,
  updateCommunity,
  followCommunity,
  unfollowCommunity,
  getCommunitiesWithDiscussionCounts,
};
