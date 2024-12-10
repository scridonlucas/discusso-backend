import prisma from '../utils/prismaClient';
import { Prisma } from '@prisma/client';

const getReportedDiscussions = async (
  limit: number,
  cursor: number | null,
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
) => {
  const where: Prisma.DiscussionReportWhereInput = {
    status: status,
  };

  const reportedDiscussions = await prisma.discussionReport.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    where,
    include: {
      user: { select: { id: true, username: true } },
      discussion: { select: { id: true, title: true, createdAt: true } },
    },
  });

  const total = await prisma.discussionReport.count({ where });

  return {
    reportedDiscussions,
    nextCursor:
      reportedDiscussions.length > 0
        ? reportedDiscussions[reportedDiscussions.length - 1].id
        : null,
    total,
  };
};

export default { getReportedDiscussions };
