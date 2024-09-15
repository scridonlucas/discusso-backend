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

  const updateDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'UPDATE_DISCUSSION',
      description: 'Can update his own discussion',
    },
  });

  const updateAnyDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_ANY_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'UPDATE_ANY_DISCUSSION',
      description: 'Can update any discussion',
    },
  });

  const deleteDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'DELETE_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'DELETE_DISCUSSION',
      description: 'Can delete his own discussion',
    },
  });

  const deleteAnyDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'DELETE_ANY_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'DELETE_ANY_DISCUSSION',
      description: 'Can delete any discussion',
    },
  });

  console.log({
    createDiscussionPermission,
    deleteDiscussionPermission,
    deleteAnyDiscussionPermission,
    updateDiscussionPermission,
    updateAnyDiscussionPermission,
  });

  await prisma.rolePermission.createMany({
    data: [
      {
        roleId: adminRole.id,
        permissionId: createDiscussionPermission.id,
      },
      {
        roleId: adminRole.id,
        permissionId: updateAnyDiscussionPermission.id,
      },
      {
        roleId: adminRole.id,
        permissionId: deleteAnyDiscussionPermission.id,
      },
      {
        roleId: moderatorRole.id,
        permissionId: createDiscussionPermission.id,
      },
      {
        roleId: moderatorRole.id,
        permissionId: updateAnyDiscussionPermission.id,
      },
      {
        roleId: moderatorRole.id,
        permissionId: deleteAnyDiscussionPermission.id,
      },
      {
        roleId: userRole.id,
        permissionId: createDiscussionPermission.id,
      },
      {
        roleId: userRole.id,
        permissionId: updateDiscussionPermission.id,
      },
      {
        roleId: userRole.id,
        permissionId: deleteDiscussionPermission.id,
      },
    ],
    skipDuplicates: true,
  });

  // seeding communities
  const investmentStrategies = await prisma.community.upsert({
    where: { name: 'Investment Strategies' },
    update: {},
    create: {
      name: 'Investment Strategies',
      description:
        'A place to discuss different investment strategies, including stocks, bonds, real estate, and alternative assets.',
    },
  });

  const personalFinance = await prisma.community.upsert({
    where: { name: 'Personal Finance' },
    update: {},
    create: {
      name: 'Personal Finance',
      description:
        'A community where members share tips and strategies for budgeting, saving, and managing personal finances.',
    },
  });

  const economicPolicy = await prisma.community.upsert({
    where: { name: 'Economic Policy & Governance' },
    update: {},
    create: {
      name: 'Economic Policy & Governance',
      description:
        'A forum for debating and discussing economic policies, regulations, and governance issues.',
    },
  });

  console.log({ investmentStrategies, personalFinance, economicPolicy });
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
