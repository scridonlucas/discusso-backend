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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWithRole = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaClient_1.default.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            gender: true,
            status: true,
            credibility: true,
            createdAt: true,
            updatedAt: true,
            role: true,
        },
    });
    return users;
});
const getUser = (id, privateData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            roleId: true,
            firstName: true,
            lastName: true,
            username: true,
            email: privateData,
            gender: true,
            status: true,
            birthDate: privateData,
            credibility: true,
            createdAt: true,
            updatedAt: true,
            followedCommunities: true,
            role: true,
            followers: true,
            following: true,
            discussions: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            notifications: true,
            bookmarks: true,
            _count: {
                select: {
                    followedCommunities: true,
                    bookmarks: true,
                    discussions: true,
                    comments: true,
                    notifications: true,
                    followers: true,
                    following: true,
                },
            },
        },
    });
    return user;
});
const getUserCount = (status, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = {
        status: status,
        createdAt: Object.assign(Object.assign({}, (startDate ? { gte: new Date(startDate) } : {})), (endDate ? { lte: new Date(endDate) } : {})),
    };
    const userCount = yield prismaClient_1.default.user.count({
        where: whereClause,
    });
    return userCount;
});
const getUserWithRole = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prismaClient_1.default.user.findUnique({
        where: { id: userId },
        include: {
            role: true,
        },
    });
});
exports.getUserWithRole = getUserWithRole;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.default.user.findUnique({
        where: { username },
    });
    return user;
});
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.default.user.findUnique({
        where: { email },
    });
    return user;
});
const addUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const passwordHash = yield bcrypt_1.default.hash(newUser.password, saltRounds);
    const user = Object.assign(Object.assign({}, newUser), { birthDate: new Date(newUser.birthDate), password: passwordHash, roleId: 3 });
    const addedUser = yield prismaClient_1.default.user.create({
        data: user,
    });
    return addedUser;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield prismaClient_1.default.user.delete({
        where: { id },
    });
    return deletedUser;
});
const updateUserStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield prismaClient_1.default.user.update({
        where: { id },
        data: { status },
    });
    return updatedUser;
});
const updateUserRole = (id, roleName) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield prismaClient_1.default.role.findUnique({
        where: { roleName: roleName },
    });
    if (!role) {
        throw new Error(`No role found with the name "${roleName}"`);
    }
    const updatedUser = yield prismaClient_1.default.user.update({
        where: { id },
        data: { roleId: role.id },
    });
    return updatedUser;
});
const followUser = (followerId, followedId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFollow = yield prismaClient_1.default.follow.findFirst({
        where: {
            followerId,
            followedId,
        },
    });
    if (existingFollow) {
        throw new Error('User already following this user');
    }
    const follow = yield prismaClient_1.default.follow.create({
        data: {
            followerId,
            followedId,
        },
    });
    return follow;
});
const unfollowUser = (followerId, followedId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFollow = yield prismaClient_1.default.follow.findFirst({
        where: {
            followerId,
            followedId,
        },
    });
    if (!existingFollow) {
        throw new Error('User is not following this user');
    }
    const unfollow = yield prismaClient_1.default.follow.delete({
        where: {
            followerId_followedId: {
                followerId,
                followedId,
            },
        },
    });
    return unfollow;
});
const getUsersWithMostDiscussions = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaClient_1.default.user.findMany({
        select: {
            id: true,
            username: true,
            _count: {
                select: {
                    discussions: true,
                },
            },
        },
        orderBy: {
            discussions: {
                _count: 'desc',
            },
        },
        take: 5,
    });
    return users;
});
const getMostFollowedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaClient_1.default.user.findMany({
        select: {
            id: true,
            username: true,
            _count: {
                select: {
                    followers: true,
                },
            },
        },
        orderBy: {
            followers: {
                _count: 'desc',
            },
        },
        take: 5,
    });
    return users;
});
exports.default = {
    getUsers,
    getUser,
    getUserWithRole: exports.getUserWithRole,
    getUserByUsername,
    getUserByEmail,
    addUser,
    deleteUser,
    updateUserStatus,
    updateUserRole,
    getUserCount,
    followUser,
    unfollowUser,
    getUsersWithMostDiscussions,
    getMostFollowedUsers,
};
