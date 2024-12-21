import prisma from '../utils/prismaClient';
import { Prisma } from '@prisma/client';
const getCommunities = async () => {
  const communities = await prisma.community.findMany({
    where: { isDeleted: false },
    include: {
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
export default { getCommunities, addCommunity, updateCommunity };
