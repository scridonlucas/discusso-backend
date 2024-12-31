"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminRole = yield prisma.role.upsert({
            where: { roleName: 'ADMIN' },
            update: {},
            create: {
                roleName: 'ADMIN',
            },
        });
        const moderatorRole = yield prisma.role.upsert({
            where: { roleName: 'MODERATOR' },
            update: {},
            create: {
                roleName: 'MODERATOR',
            },
        });
        const userRole = yield prisma.role.upsert({
            where: { roleName: 'USER' },
            update: {},
            create: {
                roleName: 'USER',
            },
        });
        const premiumRole = yield prisma.role.upsert({
            where: { roleName: 'PREMIUM' },
            update: {},
            create: {
                roleName: 'PREMIUM',
            },
        });
        console.log({ adminRole, userRole, premiumRole, moderatorRole });
        const createDiscussionPermission = yield prisma.permission.upsert({
            where: { permissionName: 'CREATE_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'CREATE_DISCUSSION',
                description: 'Can create a discussion',
            },
        });
        const getDiscussionsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_DISCUSSIONS' },
            update: {},
            create: {
                permissionName: 'GET_DISCUSSIONS',
                description: 'Can get discussions',
            },
        });
        const updateOwnDiscussionPermission = yield prisma.permission.upsert({
            where: { permissionName: 'UPDATE_OWN_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'UPDATE_OWN_DISCUSSION',
                description: 'Can update his own discussion',
            },
        });
        const updateAnyDiscussionPermission = yield prisma.permission.upsert({
            where: { permissionName: 'UPDATE_ANY_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'UPDATE_ANY_DISCUSSION',
                description: 'Can update any discussion',
            },
        });
        const deleteOwnDiscussionPermission = yield prisma.permission.upsert({
            where: { permissionName: 'DELETE_OWN_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'DELETE_OWN_DISCUSSION',
                description: 'Can delete his own discussion',
            },
        });
        const deleteAnyDiscussionPermission = yield prisma.permission.upsert({
            where: { permissionName: 'DELETE_ANY_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'DELETE_ANY_DISCUSSION',
                description: 'Can delete any discussion',
            },
        });
        const reportDiscussionPermission = yield prisma.permission.upsert({
            where: { permissionName: 'REPORT_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'REPORT_DISCUSSION',
                description: 'Can report a discussion',
            },
        });
        const getDiscussionReportsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_DISCUSSION_REPORTS' },
            update: {},
            create: {
                permissionName: 'GET_DISCUSSION_REPORTS',
                description: 'Can get reported discussions',
            },
        });
        const changeDiscussionReportStatusPermission = yield prisma.permission.upsert({
            where: { permissionName: 'CHANGE_DISCUSSION_REPORT_STATUS' },
            update: {},
            create: {
                permissionName: 'CHANGE_DISCUSSION_REPORT_STATUS',
                description: 'Can change reported discussion status',
            },
        });
        const createCommunityPermission = yield prisma.permission.upsert({
            where: { permissionName: 'CREATE_COMMUNITY' },
            update: {},
            create: {
                permissionName: 'CREATE_COMMUNITY',
                description: 'Can create a community',
            },
        });
        const deleteCommunityPermission = yield prisma.permission.upsert({
            where: { permissionName: 'DELETE_COMMUNITY' },
            update: {},
            create: {
                permissionName: 'DELETE_COMMUNITY',
                description: 'Can delete a community',
            },
        });
        const updateCommunityPermission = yield prisma.permission.upsert({
            where: { permissionName: 'UPDATE_COMMUNITY' },
            update: {},
            create: {
                permissionName: 'UPDATE_COMMUNITY',
                description: 'Can update a community',
            },
        });
        const likeDiscussionPermission = yield prisma.permission.upsert({
            where: { permissionName: 'LIKE_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'LIKE_DISCUSSION',
                description: 'Can like a discussion',
            },
        });
        const removeLikePermission = yield prisma.permission.upsert({
            where: { permissionName: 'REMOVE_LIKE_FROM_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'REMOVE_LIKE_FROM_DISCUSSION',
                description: 'Can remove a like',
            },
        });
        const commentDiscussionPermission = yield prisma.permission.upsert({
            where: { permissionName: 'COMMENT_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'COMMENT_DISCUSSION',
                description: 'Can comment on a discussion',
            },
        });
        const removeOwnCommentPermission = yield prisma.permission.upsert({
            where: { permissionName: 'REMOVE_OWN_COMMENT_FROM_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'REMOVE_OWN_COMMENT_FROM_DISCUSSION',
                description: 'Can remove his own comment',
            },
        });
        const removeAnyCommentPermission = yield prisma.permission.upsert({
            where: { permissionName: 'REMOVE_ANY_COMMENT_FROM_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'REMOVE_ANY_COMMENT_FROM_DISCUSSION',
                description: 'Can remove any comment',
            },
        });
        const likeCommentPermission = yield prisma.permission.upsert({
            where: { permissionName: 'LIKE_COMMENT' },
            update: {},
            create: {
                permissionName: 'LIKE_COMMENT',
                description: 'Can like a comment',
            },
        });
        const removeLikeCommentPermission = yield prisma.permission.upsert({
            where: { permissionName: 'REMOVE_LIKE_FROM_COMMENT' },
            update: {},
            create: {
                permissionName: 'REMOVE_LIKE_FROM_COMMENT',
                description: 'Can remove a like from a comment',
            },
        });
        const reportCommentPermission = yield prisma.permission.upsert({
            where: { permissionName: 'REPORT_COMMENT' },
            update: {},
            create: {
                permissionName: 'REPORT_COMMENT',
                description: 'Can report a comment',
            },
        });
        const getCommentReportsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_COMMENT_REPORTS' },
            update: {},
            create: {
                permissionName: 'GET_COMMENT_REPORTS',
                description: 'Can get comment reports',
            },
        });
        const changeCommentReportStatusPermission = yield prisma.permission.upsert({
            where: { permissionName: 'CHANGE_COMMENT_REPORT_STATUS' },
            update: {},
            create: {
                permissionName: 'CHANGE_COMMENT_REPORT_STATUS',
                description: 'Can change comment report status',
            },
        });
        const addBookmarkPermission = yield prisma.permission.upsert({
            where: { permissionName: 'ADD_BOOKMARK_TO_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'ADD_BOOKMARK_TO_DISCUSSION',
                description: 'Can add a bookmark',
            },
        });
        const removeBookmarkPermission = yield prisma.permission.upsert({
            where: { permissionName: 'REMOVE_BOOKMARK_FROM_DISCUSSION' },
            update: {},
            create: {
                permissionName: 'REMOVE_BOOKMARK_FROM_DISCUSSION',
                description: 'Can remove a bookmark',
            },
        });
        const updateUserStatus = yield prisma.permission.upsert({
            where: { permissionName: 'UPDATE_USER_STATUS' },
            update: {},
            create: {
                permissionName: 'UPDATE_USER_STATUS',
                description: 'Can update user status',
            },
        });
        const updateUserRole = yield prisma.permission.upsert({
            where: { permissionName: 'UPDATE_USER_ROLE' },
            update: {},
            create: {
                permissionName: 'UPDATE_USER_ROLE',
                description: 'Can update user role',
            },
        });
        const getUsers = yield prisma.permission.upsert({
            where: { permissionName: 'GET_USERS' },
            update: {},
            create: {
                permissionName: 'GET_USERS',
                description: 'Can get a list of users',
            },
        });
        const createLog = yield prisma.permission.upsert({
            where: { permissionName: 'CREATE_LOG' },
            update: {},
            create: {
                permissionName: 'CREATE_LOG',
                description: 'Can create a log',
            },
        });
        const getLogs = yield prisma.permission.upsert({
            where: { permissionName: 'GET_LOGS' },
            update: {},
            create: {
                permissionName: 'GET_LOGS',
                description: 'Can get logs',
            },
        });
        const closeTicket = yield prisma.permission.upsert({
            where: { permissionName: 'CLOSE_TICKET' },
            update: {},
            create: {
                permissionName: 'CLOSE_TICKET',
                description: 'Can close a ticket',
            },
        });
        const followCommunity = yield prisma.permission.upsert({
            where: { permissionName: 'FOLLOW_COMMUNITY' },
            update: {},
            create: {
                permissionName: 'FOLLOW_COMMUNITY',
                description: 'Can follow a community',
            },
        });
        const getAnyUserDetailsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_ANY_USER_DETAILS' },
            update: {},
            create: {
                permissionName: 'GET_ANY_USER_DETAILS',
                description: 'Can get any user details',
            },
        });
        const getOwnUserDetailsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_OWN_USER_DETAILS' },
            update: {},
            create: {
                permissionName: 'GET_OWN_USER_DETAILS',
                description: 'Can get own user details',
            },
        });
        const getPublicUserDetailsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_PUBLIC_USER_DETAILS' },
            update: {},
            create: {
                permissionName: 'GET_PUBLIC_USER_DETAILS',
                description: 'Can get public user details',
            },
        });
        const getOwnNotificationsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_OWN_NOTIFICATIONS' },
            update: {},
            create: {
                permissionName: 'GET_OWN_NOTIFICATIONS',
                description: 'Can get own notifications',
            },
        });
        const updateOwnNotificationsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'UPDATE_OWN_NOTIFICATIONS' },
            update: {},
            create: {
                permissionName: 'UPDATE_OWN_NOTIFICATIONS',
                description: 'Can update own notifications',
            },
        });
        const followUserPermission = yield prisma.permission.upsert({
            where: { permissionName: 'FOLLOW_USER' },
            update: {},
            create: {
                permissionName: 'FOLLOW_USER',
                description: 'Can follow a user',
            },
        });
        const getAdminStatisticsPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_ADMIN_STATISTICS' },
            update: {},
            create: {
                permissionName: 'GET_ADMIN_STATISTICS',
                description: 'Can get admin statistics',
            },
        });
        const manageStockPermission = yield prisma.permission.upsert({
            where: { permissionName: 'MANAGE_STOCKS' },
            update: {},
            create: {
                permissionName: 'MANAGE_STOCKS',
                description: 'Can manage stocks to favorite list',
            },
        });
        const getStocksDataPermission = yield prisma.permission.upsert({
            where: { permissionName: 'GET_STOCKS_DATA' },
            update: {},
            create: {
                permissionName: 'GET_STOCKS_DATA',
                description: 'Can get stocks data',
            },
        });
        const rolePermissions = [
            {
                roleId: adminRole.id,
                permissions: [
                    createDiscussionPermission.id,
                    updateAnyDiscussionPermission.id,
                    deleteAnyDiscussionPermission.id,
                    reportDiscussionPermission.id,
                    getDiscussionReportsPermission.id,
                    likeDiscussionPermission.id,
                    removeLikePermission.id,
                    commentDiscussionPermission.id,
                    removeAnyCommentPermission.id,
                    likeCommentPermission.id,
                    removeLikeCommentPermission.id,
                    reportCommentPermission.id,
                    getCommentReportsPermission.id,
                    createCommunityPermission.id,
                    deleteCommunityPermission.id,
                    updateCommunityPermission.id,
                    addBookmarkPermission.id,
                    removeBookmarkPermission.id,
                    changeCommentReportStatusPermission.id,
                    changeDiscussionReportStatusPermission.id,
                    updateUserStatus.id,
                    createLog.id,
                    getLogs.id,
                    closeTicket.id,
                    getUsers.id,
                    updateUserRole.id,
                    getDiscussionsPermission.id,
                    followCommunity.id,
                    getAnyUserDetailsPermission.id,
                    getPublicUserDetailsPermission.id,
                    updateOwnNotificationsPermission.id,
                    followUserPermission.id,
                    getOwnNotificationsPermission.id,
                    getOwnUserDetailsPermission.id,
                    getAdminStatisticsPermission.id,
                    manageStockPermission.id,
                    getStocksDataPermission.id,
                ],
            },
            {
                roleId: moderatorRole.id,
                permissions: [
                    createDiscussionPermission.id,
                    updateAnyDiscussionPermission.id,
                    deleteAnyDiscussionPermission.id,
                    reportDiscussionPermission.id,
                    getDiscussionReportsPermission.id,
                    likeDiscussionPermission.id,
                    removeLikePermission.id,
                    commentDiscussionPermission.id,
                    removeAnyCommentPermission.id,
                    likeCommentPermission.id,
                    removeLikeCommentPermission.id,
                    getCommentReportsPermission.id,
                    reportCommentPermission.id,
                    createCommunityPermission.id,
                    deleteCommunityPermission.id,
                    updateCommunityPermission.id,
                    addBookmarkPermission.id,
                    removeBookmarkPermission.id,
                    changeCommentReportStatusPermission.id,
                    changeDiscussionReportStatusPermission.id,
                    createLog.id,
                    getLogs.id,
                    closeTicket.id,
                    getUsers.id,
                    getDiscussionsPermission.id,
                    followCommunity.id,
                    getAnyUserDetailsPermission.id,
                    getPublicUserDetailsPermission.id,
                    updateOwnNotificationsPermission.id,
                    followUserPermission.id,
                    getOwnNotificationsPermission.id,
                    getOwnUserDetailsPermission.id,
                    manageStockPermission.id,
                    getStocksDataPermission.id,
                ],
            },
            {
                roleId: userRole.id,
                permissions: [
                    createDiscussionPermission.id,
                    updateOwnDiscussionPermission.id,
                    deleteOwnDiscussionPermission.id,
                    reportDiscussionPermission.id,
                    likeDiscussionPermission.id,
                    removeLikePermission.id,
                    commentDiscussionPermission.id,
                    removeOwnCommentPermission.id,
                    likeCommentPermission.id,
                    removeLikeCommentPermission.id,
                    reportCommentPermission.id,
                    addBookmarkPermission.id,
                    removeBookmarkPermission.id,
                    getDiscussionsPermission.id,
                    followCommunity.id,
                    getOwnUserDetailsPermission.id,
                    getPublicUserDetailsPermission.id,
                    getOwnNotificationsPermission.id,
                    updateOwnNotificationsPermission.id,
                    followUserPermission.id,
                    manageStockPermission.id,
                    getStocksDataPermission.id,
                ],
            },
        ];
        const data = rolePermissions.flatMap(({ roleId, permissions }) => permissions.map((permissionId) => ({
            roleId,
            permissionId,
        })));
        yield prisma.rolePermission.createMany({
            data,
            skipDuplicates: true,
        });
        // seeding communities
        const userId = 1; // admin user
        // Seeding communities
        const investmentStrategies = yield prisma.community.upsert({
            where: { name: 'Investment Strategies' },
            update: {},
            create: {
                name: 'Investment Strategies',
                description: 'A place to discuss different investment strategies, including stocks, bonds, real estate, and alternative assets.',
                user: {
                    connect: { id: userId },
                },
            },
        });
        const personalFinance = yield prisma.community.upsert({
            where: { name: 'Personal Finance' },
            update: {},
            create: {
                name: 'Personal Finance',
                description: 'A community where members share tips and strategies for budgeting, saving, and managing personal finances.',
                user: {
                    connect: { id: userId },
                },
            },
        });
        const economicPolicy = yield prisma.community.upsert({
            where: { name: 'Economic Policy & Governance' },
            update: {},
            create: {
                name: 'Economic Policy & Governance',
                description: 'A forum for debating and discussing economic policies, regulations, and governance issues.',
                user: {
                    connect: { id: userId }, // Connect to an existing user
                },
            },
        });
        console.log({ investmentStrategies, personalFinance, economicPolicy });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
