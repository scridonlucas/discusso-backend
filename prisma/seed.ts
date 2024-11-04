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

  const updateOwnDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_OWN_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'UPDATE_OWN_DISCUSSION',
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

  const deleteOwnDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'DELETE_OWN_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'DELETE_OWN_DISCUSSION',
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

  const createCommunityPermission = await prisma.permission.upsert({
    where: { permissionName: 'CREATE_COMMUNITY' },
    update: {},
    create: {
      permissionName: 'CREATE_COMMUNITY',
      description: 'Can create a community',
    },
  });

  const deleteCommunityPermission = await prisma.permission.upsert({
    where: { permissionName: 'DELETE_COMMUNITY' },
    update: {},
    create: {
      permissionName: 'DELETE_COMMUNITY',
      description: 'Can delete a community',
    },
  });

  const updateCommunityPermission = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_COMMUNITY' },
    update: {},
    create: {
      permissionName: 'UPDATE_COMMUNITY',
      description: 'Can update a community',
    },
  });

  const likeDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'LIKE_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'LIKE_DISCUSSION',
      description: 'Can like a discussion',
    },
  });

  const removeLikePermission = await prisma.permission.upsert({
    where: { permissionName: 'REMOVE_LIKE_FROM_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'REMOVE_LIKE_FROM_DISCUSSION',
      description: 'Can remove a like',
    },
  });

  const addBookmarkPermission = await prisma.permission.upsert({
    where: { permissionName: 'ADD_BOOKMARK_TO_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'ADD_BOOKMARK_TO_DISCUSSION',
      description: 'Can add a bookmark',
    },
  });

  const removeBookmarkPermission = await prisma.permission.upsert({
    where: { permissionName: 'REMOVE_BOOKMARK_FROM_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'REMOVE_BOOKMARK_FROM_DISCUSSION',
      description: 'Can remove a bookmark',
    },
  });

  console.log({
    createDiscussionPermission,
    deleteOwnDiscussionPermission,
    deleteAnyDiscussionPermission,
    updateOwnDiscussionPermission,
    updateAnyDiscussionPermission,
    createCommunityPermission,
    deleteCommunityPermission,
    updateCommunityPermission,
    likeDiscussionPermission,
    removeLikePermission,
    addBookmarkPermission,
    removeBookmarkPermission,
  });

  const rolePermissions = [
    {
      roleId: adminRole.id,
      permissions: [
        createDiscussionPermission.id,
        updateAnyDiscussionPermission.id,
        deleteAnyDiscussionPermission.id,
        likeDiscussionPermission.id,
        removeLikePermission.id,
        createCommunityPermission.id,
        deleteCommunityPermission.id,
        updateCommunityPermission.id,
        addBookmarkPermission.id,
        removeBookmarkPermission.id,
      ],
    },
    {
      roleId: moderatorRole.id,
      permissions: [
        createDiscussionPermission.id,
        updateAnyDiscussionPermission.id,
        deleteAnyDiscussionPermission.id,
        likeDiscussionPermission.id,
        removeLikePermission.id,
        createCommunityPermission.id,
        deleteCommunityPermission.id,
        updateCommunityPermission.id,
        addBookmarkPermission.id,
        removeBookmarkPermission.id,
      ],
    },
    {
      roleId: userRole.id,
      permissions: [
        createDiscussionPermission.id,
        updateOwnDiscussionPermission.id,
        deleteOwnDiscussionPermission.id,
        likeDiscussionPermission.id,
        removeLikePermission.id,
        addBookmarkPermission.id,
        removeBookmarkPermission.id,
      ],
    },
  ];

  const data = rolePermissions.flatMap(({ roleId, permissions }) =>
    permissions.map((permissionId) => ({
      roleId,
      permissionId,
    }))
  );

  await prisma.rolePermission.createMany({
    data,
    skipDuplicates: true,
  });

  // seeding communities
  const userId = 1; // admin user

  // Seeding communities
  const investmentStrategies = await prisma.community.upsert({
    where: { name: 'Investment Strategies' },
    update: {},
    create: {
      name: 'Investment Strategies',
      description:
        'A place to discuss different investment strategies, including stocks, bonds, real estate, and alternative assets.',
      user: {
        connect: { id: userId },
      },
    },
  });

  const personalFinance = await prisma.community.upsert({
    where: { name: 'Personal Finance' },
    update: {},
    create: {
      name: 'Personal Finance',
      description:
        'A community where members share tips and strategies for budgeting, saving, and managing personal finances.',
      user: {
        connect: { id: userId },
      },
    },
  });

  const economicPolicy = await prisma.community.upsert({
    where: { name: 'Economic Policy & Governance' },
    update: {},
    create: {
      name: 'Economic Policy & Governance',
      description:
        'A forum for debating and discussing economic policies, regulations, and governance issues.',
      user: {
        connect: { id: userId }, // Connect to an existing user
      },
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
