import prisma from '../utils/prismaClient';
import { CustomDiscussionError } from '../utils/customErrors';
import { reportReason } from '../types/discussionType';

async function addCommentLike(userId: number, commentId: number) {
  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: { userId, commentId },
    },
  });

  if (existingLike) {
    throw new CustomDiscussionError('User has already liked this comment');
  }

  const like = await prisma.commentLike.create({
    data: {
      userId,
      commentId,
    },
    include: { user: { select: { id: true, username: true } } },
  });

  return like;
}

const removeCommentLike = async (userId: number, commentId: number) => {
  const existingLike = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (!existingLike) {
    throw new CustomDiscussionError('User has not liked this comment');
  }

  const removedLike = await prisma.commentLike.delete({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  return removedLike;
};

const addComentReport = async (
  commentId: number,
  userId: number,
  reason: reportReason
) => {
  const existingPendingReport = await prisma.commentReport.findFirst({
    where: {
      commentId,
      userId,
      status: 'PENDING',
    },
  });

  if (existingPendingReport) {
    throw new CustomDiscussionError(
      `You have already reported this comment and it is currently under review.`
    );
  }

  const newReport = await prisma.commentReport.create({
    data: {
      commentId,
      userId,
      reason,
    },
  });

  return newReport;
};

export default { addCommentLike, removeCommentLike, addComentReport };
