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
      comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
          user: true,
        },
      },
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

const getCommentReportsCount = async (
  status?: 'PENDING' | 'RESOLVED' | 'DISMISSED'
) => {
  const where: Prisma.CommentReportWhereInput = {
    status: status,
  };

  const count = await prisma.commentReport.count({ where });

  return count;
};

const getCommentReportById = async (id: number) => {
  const commentReport = await prisma.commentReport.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true } },
      comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
          discussionId: true,
        },
      },
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

const closeCommentReport = async (
  adminId: number,
  reportId: number,
  action: 'DISMISS' | 'REMOVE_RESOURCE' | 'REMOVE_AND_BAN'
) => {
  return await prisma.$transaction(async (tx) => {
    const existingReport = await tx.commentReport.findUnique({
      where: { id: reportId },
      select: {
        status: true,
        commentId: true,
        reason: true,
        comment: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existingReport || existingReport.status !== 'PENDING') {
      throw new CustomReportError('This ticket is already closed.');
    }

    const updatedReport = await tx.commentReport.update({
      where: { id: reportId },
      data: {
        status: action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED',
        reviewedAt: new Date(),
        notes: existingReport.reason,
      },
    });

    if (action === 'REMOVE_RESOURCE' || action === 'REMOVE_AND_BAN') {
      await tx.comment.update({
        where: { id: existingReport.commentId },
        data: { isDeleted: true },
      });
    }

    if (action === 'REMOVE_AND_BAN') {
      await tx.user.update({
        where: { id: existingReport.comment.userId },
        data: { status: 'BANNED' },
      });
    }

    await tx.moderationLog.create({
      data: {
        adminId,
        userId: existingReport.comment.userId,
        action,
        targetId: existingReport.commentId,
      },
    });
    return updatedReport;
  });
};

export default {
  getReportedComments,
  getCommentReportById,
  updateCommentReportStatus,
  closeCommentReport,
  getCommentReportsCount,
};
