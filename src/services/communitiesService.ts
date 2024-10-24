import prisma from '../utils/prismaClient';

const getCommunities = async () => {
  const communities = await prisma.community.findMany();
  return communities;
};

export default { getCommunities };
