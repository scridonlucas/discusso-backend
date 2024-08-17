import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { roleName: 'ADMIN' },
    update: {},
    create: {
      roleName: 'ADMIN',
    },
  });

  const moderatorRole = await prisma.role.upsert({
    where: { roleName: 'MODERATOR' },
    update: {},
    create: {
      roleName: 'MODERATOR',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { roleName: 'USER' },
    update: {},
    create: {
      roleName: 'USER',
    },
  });

  const premiumRole = await prisma.role.upsert({
    where: { roleName: 'PREMIUM' },
    update: {},
    create: {
      roleName: 'PREMIUM',
    },
  });

  console.log({ adminRole, userRole, premiumRole, moderatorRole });

  const createDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'CREATE_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'CREATE_DISCUSSION',
      description: 'Can create a discussion',
    },
  });

  const deleteDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'DELETE_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'DELETE_DISCUSSION',
      description: 'Can delete a discussion',
    },
  });

  console.log({ createDiscussionPermission, deleteDiscussionPermission });

  await prisma.rolePermission.createMany({
    data: [
      {
        roleId: adminRole.id,
        permissionId: createDiscussionPermission.id,
      },
      {
        roleId: adminRole.id,
        permissionId: deleteDiscussionPermission.id,
      },
      {
        roleId: moderatorRole.id,
        permissionId: createDiscussionPermission.id,
      },
      {
        roleId: moderatorRole.id,
        permissionId: deleteDiscussionPermission.id,
      },
      {
        roleId: userRole.id,
        permissionId: createDiscussionPermission.id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
