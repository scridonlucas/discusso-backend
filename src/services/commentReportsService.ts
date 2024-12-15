import prisma from '../utils/prismaClient';
import { Prisma } from '@prisma/client';
import { CustomReportError } from '../utils/customErrors';

const getReportedComments = async (
  limit: number,
  cursor: number | null,
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
) => {
  const where: Prisma.CommentReportWhereInput = {
    status: status,
  };

  const commentReports = await prisma.commentReport.findMany({
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
    commentReports,
    nextCursor:
      commentReports.length === limit
        ? commentReports[commentReports.length - 1].id
        : null,
    total,
  };
};

const getCommentReportById = async (id: number) => {
  const commentReport = await prisma.commentReport.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true } },
      comment: { select: { id: true, content: true, createdAt: true } },
    },
  });

  if (!commentReport) {
    throw new CustomReportError('Comment report not found');
  }

  return commentReport;
};

const updateCommentReportStatus = async (
  id: number,
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
) => {
  const commentReport = await prisma.commentReport.update({
    where: { id: id },
    data: { status: status, reviewedAt: new Date() },
  });

  return commentReport;
};
export default {
  getReportedComments,
  getCommentReportById,
  updateCommentReportStatus,
};
