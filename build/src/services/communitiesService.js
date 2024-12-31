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
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const customErrors_1 = require("../utils/customErrors");
const getCommunities = () => __awaiter(void 0, void 0, void 0, function* () {
    const communities = yield prismaClient_1.default.community.findMany({
        where: { isDeleted: false },
        include: {
            followers: { select: { id: true } },
            _count: {
                select: {
                    discussions: true,
                    followers: true,
                },
            },
        },
    });
    return communities;
});
const getCommunityById = (communityId) => __awaiter(void 0, void 0, void 0, function* () {
    const community = yield prismaClient_1.default.community.findUnique({
        where: { id: communityId },
        include: {
            followers: { select: { id: true } },
            _count: {
                select: {
                    discussions: true,
                    followers: true,
                },
            },
        },
    });
    return community;
});
const addCommunity = (communityName, userId, description) => __awaiter(void 0, void 0, void 0, function* () {
    const community = yield prismaClient_1.default.community.create({
        data: {
            name: communityName,
            userId: userId,
            description,
        },
    });
    return community;
});
const getCommunitiesWithDiscussionCounts = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prismaClient_1.default.community.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    discussions: true,
                },
            },
        },
        take: 5,
    });
    return count;
});
const updateCommunity = (communityId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const community = yield prismaClient_1.default.community.update({
        where: { id: communityId },
        data: data,
    });
    return community;
});
const followCommunity = (userId, communityId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFollow = yield prismaClient_1.default.userCommunity.findFirst({
        where: {
            userId,
            communityId,
        },
    });
    if (existingFollow) {
        throw new customErrors_1.CustomCommunityError('User already following this community');
    }
    const follow = yield prismaClient_1.default.userCommunity.create({
        data: {
            userId,
            communityId,
        },
    });
    return follow;
});
const unfollowCommunity = (userId, communityId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFollow = yield prismaClient_1.default.userCommunity.findFirst({
        where: {
            userId,
            communityId,
        },
    });
    if (!existingFollow) {
        throw new customErrors_1.CustomCommunityError('User is not following this community');
    }
    const unfollow = yield prismaClient_1.default.userCommunity.delete({
        where: {
            userId_communityId: {
                userId,
                communityId,
            },
        },
    });
    return unfollow;
});
exports.default = {
    getCommunities,
    addCommunity,
    getCommunityById,
    updateCommunity,
    followCommunity,
    unfollowCommunity,
    getCommunitiesWithDiscussionCounts,
};
