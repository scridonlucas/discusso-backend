import prisma from '../utils/prismaClient';
import { Prisma } from '@prisma/client';
import { CustomReportError } from '../utils/customErrors';
const getDiscussionReports = async (
  limit: number,
  cursor: number | null,
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
) => {
  const where: Prisma.DiscussionReportWhereInput = {
    status: status,
  };

  const discussionReports = await prisma.discussionReport.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    where,
    include: {
      user: { select: { id: true, username: true, email: true } },
      discussion: {
        select: { id: true, title: true, content: true, createdAt: true },
      },
    },
  });

  const nextCursor =
    discussionReports.length === limit
      ? discussionReports[discussionReports.length - 1].id
      : null;

  const total = await prisma.discussionReport.count({ where });

  return {
    discussionReports,
    nextCursor,
    total,
  };
};

const getDiscussionReportById = async (id: number) => {
  const discussionReport = await prisma.discussionReport.findUnique({
    where: { id: id },
    include: {
      user: { select: { id: true, username: true, email: true } },
      discussion: { select: { id: true, title: true, content: true } },
    },
  });

  if (!discussionReport) {
    throw new CustomReportError('Discussion report not found');
  }

  return discussionReport;
};

export default { getDiscussionReports, getDiscussionReportById };
