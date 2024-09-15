import prisma from '../utils/prismaClient';
import { CustomPermissionError } from '../utils/customErrors';

const getPermissions = async (
  userId: number,
  permissions: string[]
): Promise<string[]> => {
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

  const userPermissionNames = user.role.permissions.map(
    (rolePermission) => rolePermission.permission.permissionName
  );

  const userHasPermissions = permissions.filter((permissionName) =>
    userPermissionNames.includes(permissionName)
  );

  if (userHasPermissions.length === 0) {
    throw new CustomPermissionError('User does not have permissions.');
  }

  return userHasPermissions;
};

export default {
  getPermissions,
};
