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
      discussion: {
        select: {
          id: true,
          title: true,
          content: true,
          userId: true,
        },
      },
    },
  });

  if (!discussionReport) {
    throw new CustomReportError('Discussion report not found');
  }

  return discussionReport;
};

const updateDiscussionReportStatus = async (
  id: number,
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'
) => {
  const discussionReport = await prisma.discussionReport.update({
    where: { id: id },
    data: { status: status, reviewedAt: new Date() },
  });

  return discussionReport;
};

const closeDiscussionReport = async (
  adminId: number,
  reportId: number,
  discussionId: number,
  reportedUserId: number,
  action: 'DISMISS' | 'REMOVE_RESOURCE' | 'REMOVE_AND_BAN',
  reason: string
) => {
  return await prisma.$transaction(async (tx) => {
    const existingReport = await tx.discussionReport.findUnique({
      where: { id: reportId },
      select: { status: true },
    });

    if (!existingReport || existingReport.status !== 'PENDING') {
      throw new CustomReportError('This ticket is already closed.');
    }
    const updatedReport = await tx.discussionReport.update({
      where: { id: reportId },
      data: {
        status: action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED',
        reviewedAt: new Date(),
        notes: reason,
      },
    });

    if (action === 'REMOVE_RESOURCE' || action === 'REMOVE_AND_BAN') {
      await tx.discussion.update({
        where: { id: discussionId },
        data: { isDeleted: true },
      });
    }

    if (action === 'REMOVE_AND_BAN') {
      await tx.user.update({
        where: { id: reportedUserId },
        data: { status: 'BANNED' },
      });
    }

    await tx.moderationLog.create({
      data: {
        adminId,
        userId: reportedUserId,
        action,
        targetId: discussionId,
      },
    });
    return updatedReport;
  });
};

export default {
  getDiscussionReports,
  getDiscussionReportById,
  updateDiscussionReportStatus,
  closeDiscussionReport,
};
