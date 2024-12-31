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
exports.hasUserLikedDiscussion = exports.getUsersWhoLikedDiscussion = exports.getTotalLikesForDiscussion = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const customErrors_1 = require("../utils/customErrors");
const notificationService_1 = __importDefault(require("./notificationService"));
const addDiscussion = (newDiscussion, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const community = yield prismaClient_1.default.community.findUnique({
        where: { id: newDiscussion.communityId },
    });
    if (!community) {
        throw new customErrors_1.CustomDiscussionError('Community not found');
    }
    const addedDiscussion = yield prismaClient_1.default.discussion.create({
        data: Object.assign(Object.assign({}, newDiscussion), { userId: userId }),
    });
    return addedDiscussion;
});
const getDiscussionsCount = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = {
        createdAt: Object.assign(Object.assign({}, (startDate ? { gte: new Date(startDate) } : {})), (endDate ? { lte: new Date(endDate) } : {})),
        isDeleted: false,
    };
    const discussionCount = yield prismaClient_1.default.discussion.count({
        where: whereClause,
    });
    return discussionCount;
});
const getDiscussions = (userId, limit, cursor, communityId = null, feedType = 'explore', sort = 'recent', dateRange = 'all', saved, search = '') => __awaiter(void 0, void 0, void 0, function* () {
    const orderBy = getOrderByOption(sort);
    const where = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, getTimeFilterCondition(dateRange)), getFeedCondition(feedType, userId)), { isDeleted: false, communityId: communityId === null ? undefined : communityId }), (saved ? { bookmarks: { some: { userId } } } : {})), (search
        ? {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {}));
    const discussions = yield prismaClient_1.default.discussion.findMany({
        take: limit + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy,
        where,
        include: {
            user: { select: { id: true, username: true } },
            community: { select: { name: true } },
            _count: { select: { likes: true, comments: true } },
            likes: {
                select: {
                    user: { select: { id: true, username: true } },
                },
            },
            bookmarks: {
                select: {
                    user: { select: { id: true, username: true } },
                },
            },
        },
    });
    const total = yield prismaClient_1.default.discussion.count({ where });
    const hasMore = discussions.length > limit;
    const results = hasMore ? discussions.slice(0, limit) : discussions;
    return {
        discussions: results,
        nextCursor: hasMore ? results[results.length - 1].id : null,
        total,
    };
});
const getTrendingDiscussions = () => __awaiter(void 0, void 0, void 0, function* () {
    const discussions = yield prismaClient_1.default.discussion.findMany({
        take: 15,
        orderBy: {
            trendingScore: 'desc',
        },
        where: { isDeleted: false },
        include: {
            user: { select: { id: true, username: true } },
            community: { select: { name: true } },
            _count: { select: { likes: true, comments: true } },
            likes: {
                select: {
                    user: { select: { id: true, username: true } },
                },
            },
            bookmarks: {
                select: {
                    user: { select: { id: true, username: true } },
                },
            },
        },
    });
    return { discussions };
});
const getDiscussionsByUser = (userId, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const discussions = yield prismaClient_1.default.discussion.findMany({
        where: { userId },
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        orderBy: { createdAt: 'desc' },
    });
    const total = yield prismaClient_1.default.discussion.count({
        where: { userId },
    });
    const hasMore = discussions.length > limit;
    const results = hasMore ? discussions.slice(0, limit) : discussions;
    return {
        discussions: results,
        nextCursor: hasMore ? results[results.length - 1].id : null,
        total,
    };
});
const getDiscussionsByCommunity = (communityId, limit, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const discussions = yield prismaClient_1.default.discussion.findMany({
        where: { communityId },
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        take: limit,
        orderBy: { createdAt: 'desc' },
    });
    const total = yield prismaClient_1.default.discussion.count({
        where: { communityId },
    });
    return {
        discussions,
        nextCursor: discussions.length > 0 ? discussions[discussions.length - 1].id : null,
        total,
    };
});
const getDiscussionById = (discussionId) => __awaiter(void 0, void 0, void 0, function* () {
    const discussion = yield prismaClient_1.default.discussion.findUnique({
        where: { id: discussionId },
        include: {
            user: true,
            community: true,
            comments: {
                include: {
                    user: { select: { id: true, username: true } },
                },
            },
            likes: {
                select: {
                    user: { select: { id: true, username: true } },
                },
            },
            bookmarks: {
                select: {
                    user: { select: { id: true, username: true } },
                },
            },
            _count: { select: { likes: true, comments: true } },
        },
    });
    if (!discussion) {
        throw new customErrors_1.CustomDiscussionError('Discussion not found');
    }
    if (discussion.isDeleted) {
        throw new customErrors_1.CustomDiscussionError('This discussion has been deleted.');
    }
    return discussion;
});
const deleteDiscussion = (discussionId, _userId) => __awaiter(void 0, void 0, void 0, function* () {
    const discussion = yield prismaClient_1.default.discussion.findUnique({
        where: { id: discussionId },
    });
    if (!discussion) {
        throw new customErrors_1.CustomDiscussionError('Discussion not found');
    }
    yield prismaClient_1.default.discussion.delete({
        where: { id: discussionId },
    });
    return { message: 'Discussion deleted successfully' };
});
const softDeleteDiscussion = (discussionId, _userId) => __awaiter(void 0, void 0, void 0, function* () {
    const discussion = yield prismaClient_1.default.discussion.findUnique({
        where: { id: discussionId },
    });
    if (!discussion) {
        throw new customErrors_1.CustomDiscussionError('Discussion not found');
    }
    yield prismaClient_1.default.discussion.update({
        where: { id: discussionId },
        data: { isDeleted: true },
    });
    return { message: 'Discussion deleted successfully' };
});
const updateDiscussion = (_userId, discussionId, discussionUpdateData) => __awaiter(void 0, void 0, void 0, function* () {
    const discussion = yield prismaClient_1.default.discussion.findUnique({
        where: { id: discussionId },
    });
    if (!discussion) {
        throw new customErrors_1.CustomDiscussionError('Discussion not found');
    }
    const updatedDiscussion = yield prismaClient_1.default.discussion.update({
        where: { id: discussionId },
        data: Object.assign(Object.assign({}, (discussionUpdateData.title && { title: discussionUpdateData.title })), (discussionUpdateData.content && {
            content: discussionUpdateData.content,
        })),
    });
    return updatedDiscussion;
});
const getDailyDiscussionsStats = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;
    const rawStats = yield prismaClient_1.default.$queryRawUnsafe(`
  SELECT
    DATE("createdAt") AS "date",
    COUNT(*) AS "count"
  FROM "Discussion"
  WHERE "isDeleted" = false
  ${startDateObj ? `AND "createdAt" >= '${startDateObj.toISOString()}'` : ''}
  ${endDateObj ? `AND "createdAt" <= '${endDateObj.toISOString()}'` : ''}
  GROUP BY DATE("createdAt")
  ORDER BY DATE("createdAt") ASC
`);
    const parsedStats = rawStats.map((stat) => ({
        date: stat.date.toISOString().split('T')[0],
        count: Number(stat.count),
    }));
    return parsedStats;
});
// likes service
const addLike = (userId, discussionId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLike = yield prismaClient_1.default.like.findUnique({
        where: {
            userId_discussionId: {
                userId,
                discussionId,
            },
        },
    });
    if (existingLike) {
        throw new customErrors_1.CustomDiscussionError('User has already liked this discussion');
    }
    const like = yield prismaClient_1.default.like.create({
        data: {
            userId,
            discussionId,
        },
        include: { user: { select: { id: true, username: true } } },
    });
    const discussion = yield prismaClient_1.default.discussion.findUnique({
        where: { id: discussionId },
        select: { userId: true },
    });
    if (!discussion) {
        throw new customErrors_1.CustomDiscussionError('Discussion not found');
    }
    yield notificationService_1.default.createNotification(discussion.userId, 'LIKE', `User ${like.user.username} liked your discussion #${discussionId}`);
    return like;
});
const deleteLike = (userId, discussionId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLike = yield prismaClient_1.default.like.findUnique({
        where: {
            userId_discussionId: {
                userId,
                discussionId,
            },
        },
    });
    if (!existingLike) {
        throw new customErrors_1.CustomDiscussionError('User has not liked this discussion.');
    }
    const removedLike = yield prismaClient_1.default.like.delete({
        where: {
            userId_discussionId: {
                userId,
                discussionId,
            },
        },
    });
    return removedLike;
});
const getTotalLikesForDiscussion = (discussionId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalLikes = yield prismaClient_1.default.like.count({
        where: { discussionId },
    });
    return totalLikes;
});
exports.getTotalLikesForDiscussion = getTotalLikesForDiscussion;
const getUsersWhoLikedDiscussion = (discussionId) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prismaClient_1.default.like.findMany({
        where: { discussionId },
        include: {
            user: true,
        },
    });
    const usersList = users.map((user) => user.user);
    return usersList;
});
exports.getUsersWhoLikedDiscussion = getUsersWhoLikedDiscussion;
const hasUserLikedDiscussion = (userId, discussionId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLike = yield prismaClient_1.default.like.findUnique({
        where: {
            userId_discussionId: {
                userId,
                discussionId,
            },
        },
    });
    if (existingLike === null) {
        return false;
    }
    else {
        return true;
    }
});
exports.hasUserLikedDiscussion = hasUserLikedDiscussion;
// bookmark / save service
const addBookmark = (userId, discussionId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBookmark = yield prismaClient_1.default.bookmark.findUnique({
        where: {
            userId_discussionId: {
                userId,
                discussionId,
            },
        },
    });
    if (existingBookmark) {
        throw new customErrors_1.CustomDiscussionError('User has already saved this discussion');
    }
    const bookmark = yield prismaClient_1.default.bookmark.create({
        data: {
            userId,
            discussionId,
        },
        include: { user: { select: { id: true, username: true } } },
    });
    return bookmark;
});
const removeBookmark = (userId, discussionId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBookmark = yield prismaClient_1.default.bookmark.findUnique({
        where: {
            userId_discussionId: {
                userId,
                discussionId,
            },
        },
    });
    if (!existingBookmark) {
        throw new customErrors_1.CustomDiscussionError('Bookmark does not exist');
    }
    const bookmark = yield prismaClient_1.default.bookmark.delete({
        where: {
            userId_discussionId: {
                userId,
                discussionId,
            },
        },
    });
    return bookmark;
});
// comment functionality
const addComment = (userId, discussionId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prismaClient_1.default.comment.create({
        data: {
            userId,
            discussionId,
            content,
        },
        include: {
            user: { select: { id: true, username: true } },
            _count: { select: { likes: true } },
        },
    });
    const discussion = yield prismaClient_1.default.discussion.findUnique({
        where: { id: discussionId },
        select: { userId: true },
    });
    if (!discussion) {
        throw new customErrors_1.CustomDiscussionError('Discussion not found');
    }
    yield notificationService_1.default.createNotification(discussion.userId, 'COMMENT', `User ${comment.user.username} commented on your discussion #${discussionId}`);
    return comment;
});
function getComments(discussionId, limit, cursor, sort = 'recent') {
    return __awaiter(this, void 0, void 0, function* () {
        const orderBy = getOrderByOptionForComments(sort);
        const comments = yield prismaClient_1.default.comment.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy,
            where: {
                discussionId,
                isDeleted: false,
            },
            include: {
                user: { select: { id: true, username: true } },
                likes: {
                    select: {
                        user: { select: { id: true, username: true } },
                    },
                },
                _count: { select: { likes: true } },
            },
        });
        const hasMore = comments.length > limit;
        const results = hasMore ? comments.slice(0, limit) : comments;
        const nextCursor = hasMore ? comments[comments.length - 1].id : null;
        const totalCount = yield prismaClient_1.default.comment.count({
            where: { discussionId },
        });
        return { comments: results, totalCount, nextCursor };
    });
}
// report logic
const addDiscussionReport = (discussionId, userId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPendingReport = yield prismaClient_1.default.discussionReport.findFirst({
        where: {
            discussionId,
            userId,
            status: 'PENDING',
        },
    });
    if (existingPendingReport) {
        throw new customErrors_1.CustomDiscussionError(`You have already reported this discussion and it is currently under review.`);
    }
    const newReport = yield prismaClient_1.default.discussionReport.create({
        data: {
            discussionId,
            userId,
            reason,
        },
    });
    return newReport;
});
// Helper functions
const getOrderByOption = (sort) => {
    switch (sort) {
        case 'recent':
            return { createdAt: 'desc' };
        case 'oldest':
            return { createdAt: 'asc' };
        case 'most_liked':
            return { likes: { _count: 'desc' } };
        case 'most_commented':
            return { comments: { _count: 'desc' } };
        default:
            return { createdAt: 'desc' };
    }
};
const getOrderByOptionForComments = (sort) => {
    switch (sort) {
        case 'recent':
            return { createdAt: 'desc' };
        case 'oldest':
            return { createdAt: 'asc' };
        case 'most_liked':
            return { likes: { _count: 'desc' } };
        default:
            return { createdAt: 'desc' };
    }
};
function getTimeFilterCondition(timeFilter) {
    const now = new Date();
    if (!timeFilter || timeFilter === 'all')
        return {};
    switch (timeFilter) {
        case 'last_hour':
            now.setHours(now.getHours() - 1);
            return { createdAt: { gte: now } };
        case 'last_day':
            now.setDate(now.getDate() - 1);
            return { createdAt: { gte: now } };
        case 'last_week':
            now.setDate(now.getDate() - 7);
            return { createdAt: { gte: now } };
        case 'last_month':
            now.setMonth(now.getMonth() - 1);
            return { createdAt: { gte: now } };
        default:
            return {};
    }
}
const getFeedCondition = (feedType, userId) => {
    if (feedType === 'explore')
        return {};
    return {
        OR: [
            { community: { followers: { some: { userId } } } },
            { user: { followers: { some: { followerId: userId } } } },
        ],
    };
};
//
exports.default = {
    addDiscussion,
    getDiscussions,
    getTrendingDiscussions,
    getDiscussionsByUser,
    getDiscussionsByCommunity,
    getDiscussionById,
    deleteDiscussion,
    softDeleteDiscussion,
    updateDiscussion,
    getDailyDiscussionsStats,
    addLike,
    deleteLike,
    getTotalLikesForDiscussion: exports.getTotalLikesForDiscussion,
    getUsersWhoLikedDiscussion: exports.getUsersWhoLikedDiscussion,
    hasUserLikedDiscussion: exports.hasUserLikedDiscussion,
    addBookmark,
    removeBookmark,
    addComment,
    getComments,
    addDiscussionReport,
    getDiscussionsCount,
};
