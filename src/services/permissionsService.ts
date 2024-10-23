import prisma from '../utils/prismaClient';
import { CustomPermissionError } from '../utils/customErrors';

const hasPermission = async (
  userId: number,
  permissionName: string
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new CustomPermissionError('User not found!');
  }

  const hasPerm = user.role.permissions.some(
    (rp) => rp.permission.permissionName === permissionName
  );

  return hasPerm;
};

export default {
  hasPermission,
};
