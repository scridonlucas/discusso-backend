import prisma from '../utils/prismaClient';

const getCommunities = async () => {
  const communities = await prisma.community.findMany();
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

export default { getCommunities, addCommunity };
