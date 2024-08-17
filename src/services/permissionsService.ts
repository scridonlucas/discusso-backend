import prisma from '../utils/prismaClient';

const hasPermission = async (
  userId: number,
  permissionName: string
): Promise<boolean> | null => {
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
    return null;
  }

  return user.role.permissions.some(
    (rp) => rp.permission.permissionName === permissionName
  );
};

export default {
  hasPermission,
};
