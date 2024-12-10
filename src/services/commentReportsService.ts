import prisma from '../utils/prismaClient';
import { Prisma } from '@prisma/client';

const getReportedComments = async (
  limit: number,
  cursor: number | null,
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
) => {
  const where: Prisma.CommentReportWhereInput = {
    status: status,
  };

  const reportedDiscussions = await prisma.commentReport.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    where,
    include: {
      user: { select: { id: true, username: true } },
      comment: { select: { id: true, content: true, createdAt: true } },
    },
  });

  const total = await prisma.commentReport.count({ where });

  return {
    reportedDiscussions,
    nextCursor:
      reportedDiscussions.length > 0
        ? reportedDiscussions[reportedDiscussions.length - 1].id
        : null,
    total,
  };
};

export default { getReportedComments };
