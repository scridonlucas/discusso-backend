import prisma from '../utils/prismaClient';
import {
  CustomPermissionError,
  CustomDiscussionError,
} from '../utils/customErrors';
import { Resource } from '../types/resourceTypes';

async function isOwner(
  resourceType: Resource,
  userId: number,
  resourceId: number
): Promise<boolean> {
  switch (resourceType) {
    case 'discussion':
      const discussion = await prisma.discussion.findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });
      if (!discussion) {
        throw new CustomDiscussionError('Discussion not found');
      }

      return discussion.userId === userId;

    default:
      throw new CustomPermissionError(
        `Unsupported resource type: ${resourceType}`
      );
  }
}

export default {
  isOwner,
};
