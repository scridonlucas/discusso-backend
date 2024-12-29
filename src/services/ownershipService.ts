import prisma from '../utils/prismaClient';
import { CustomPermissionError } from '../utils/customErrors';
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
        throw new CustomPermissionError('Discussion not found');
      }

      return discussion.userId === userId;

    case 'user':
      const user = await prisma.user.findUnique({
        where: { id: resourceId },
        select: { id: true },
      });

      if (!user) {
        throw new CustomPermissionError('User not found');
      }

      return user.id === userId;

    default:
      throw new CustomPermissionError(
        `Unsupported resource type: ${resourceType}`
      );
  }
}

export default {
  isOwner,
};
