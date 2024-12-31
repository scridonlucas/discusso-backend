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
require("express-async-errors");
const middleware_1 = __importDefault(require("../utils/middleware"));
const discussionsService_1 = __importDefault(require("../services/discussionsService"));
const express_1 = require("express");
const discussionsRouter = (0, express_1.Router)();
discussionsRouter.post('/', middleware_1.default.checkPermission('CREATE_DISCUSSION'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const { title, content, communityId } = req.body;
    if (!title || !content || !communityId) {
        return res
            .status(400)
            .json({ error: 'Title, content, and communityId are required' });
    }
    if (typeof communityId !== 'number' || communityId <= 0) {
        return res
            .status(400)
            .json({ error: 'communityId must be a positive number' });
    }
    if (title.length < 3) {
        return res
            .status(400)
            .json({ error: 'Title must be at least 3 characters long' });
    }
    if (title.length > 300) {
        return res
            .status(400)
            .json({ error: 'Title cannot exceed 300 characters' });
    }
    if (content.length < 20) {
        return res
            .status(400)
            .json({ error: 'Content should contain at least 20 characters' });
    }
    if (content.length > 1000) {
        return res
            .status(400)
            .json({ error: 'Content cannot exceed 1000 characters' });
    }
    if (!/^[A-Za-z0-9\s]+$/.test(title)) {
        return res.status(400).json({
            error: 'Title can only contain letters, numbers, and spaces',
        });
    }
    if (!/^[A-Za-z0-9\s.,?!'"@#$%^&*()[\]{}\-_=+\\|;:<>/~`]+$/.test(content)) {
        return res.status(400).json({
            error: 'Content can only contain letters, numbers, and common punctuation',
        });
    }
    const discussion = yield discussionsService_1.default.addDiscussion({ title, content, communityId }, userId);
    return res.status(201).json(discussion);
}));
discussionsRouter.get('/count', middleware_1.default.jwtVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    const decodedStartDate = decodeURIComponent(startDate || '');
    const decodedEndDate = decodeURIComponent(endDate || '');
    const discussionsCount = yield discussionsService_1.default.getDiscussionsCount(decodedStartDate, decodedEndDate);
    res.status(200).json(discussionsCount);
}));
discussionsRouter.get('/', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const communityId = req.query.community_id
        ? parseInt(req.query.community_id, 10)
        : null;
    const feedType = req.query.feed_type ? req.query.feed_type : 'explore';
    const sort = req.query.sort ? req.query.sort : 'recent';
    const dateRange = req.query.date_range ? req.query.date_range : 'all';
    const saved = req.query.saved ? true : false;
    const search = req.query.search ? req.query.search : '';
    const discussions = yield discussionsService_1.default.getDiscussions(userId, limit, cursor, communityId, feedType, sort, dateRange, saved, search);
    return res.status(200).json(discussions);
}));
discussionsRouter.get('/daily-stats', middleware_1.default.checkPermission('GET_ADMIN_STATISTICS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    const stats = yield discussionsService_1.default.getDailyDiscussionsStats(startDate, endDate);
    return res.json(stats);
}));
discussionsRouter.get('/trending', (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const discussions = yield discussionsService_1.default.getTrendingDiscussions();
    return res.status(200).json(discussions);
}));
discussionsRouter.get('/users/:userId/discussions', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const discussions = yield discussionsService_1.default.getDiscussionsByUser(userId, limit, cursor);
    return res.status(200).json(discussions);
}));
discussionsRouter.get('/users/:communityId/discussions', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const communityId = Number(req.params.communityId);
    if (isNaN(communityId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const discussions = yield discussionsService_1.default.getDiscussionsByCommunity(communityId, limit, cursor);
    return res.status(200).json(discussions);
}));
discussionsRouter.get('/:discussionId', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const discussion = yield discussionsService_1.default.getDiscussionById(discussionId);
    return res.status(200).json(discussion);
}));
discussionsRouter.delete('/:discussionId', middleware_1.default.checkPermissionWithOwnership('discussion', 'discussionId', 'DELETE_OWN_DISCUSSION', 'DELETE_ANY_DISCUSSION'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const deletedDiscussion = yield discussionsService_1.default.softDeleteDiscussion(discussionId, userId);
    return res.status(200).json(deletedDiscussion);
}));
discussionsRouter.put('/:discussionId', middleware_1.default.checkPermissionWithOwnership('discussion', 'discussionId', 'UPDATE_OWN_DISCUSSION', 'UPDATE_ANY_DISCUSSION'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const discussionId = Number(req.params.discussionId);
    const userId = req.decodedToken.id;
    const { title, content } = req.body;
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    if (!title && !content) {
        return res.status(400).json({
            error: 'At least one of title or content must be provided.',
        });
    }
    if (title !== undefined) {
        if (title.length < 3) {
            return res
                .status(400)
                .json({ error: 'Title must be at least 3 characters long' });
        }
        if (title.length > 300) {
            return res
                .status(400)
                .json({ error: 'Title cannot exceed 300 characters' });
        }
        if (!/^[A-Za-z0-9\s]+$/.test(title)) {
            return res.status(400).json({
                error: 'Title can only contain letters, numbers, and spaces',
            });
        }
    }
    if (content !== undefined) {
        if (content.length < 20) {
            return res
                .status(400)
                .json({ error: 'Content should contain at least 20 characters' });
        }
        if (content.length > 1000) {
            return res
                .status(400)
                .json({ error: 'Content cannot exceed 1000 characters' });
        }
        if (!/^[A-Za-z0-9\s.,?!'"@#$%^&*()[\]{}\-_=+\\|;:<>/~`]+$/.test(content)) {
            return res.status(400).json({
                error: 'Content can only contain letters, numbers, and common punctuation',
            });
        }
    }
    const updatedDiscussion = yield discussionsService_1.default.updateDiscussion(discussionId, userId, { title, content });
    return res.status(200).json({ updatedDiscussion });
}));
// likes functionality
discussionsRouter.post('/:discussionId/like', middleware_1.default.checkPermission('LIKE_DISCUSSION'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const like = yield discussionsService_1.default.addLike(userId, discussionId);
    return res.status(201).json(like);
}));
discussionsRouter.delete('/:discussionId/like', middleware_1.default.checkPermission('REMOVE_LIKE_FROM_DISCUSSION'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const removedLike = yield discussionsService_1.default.deleteLike(userId, discussionId);
    return res.status(200).json(removedLike);
}));
discussionsRouter.get('/:discussionId/likes/count', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const totalLikes = yield discussionsService_1.default.getTotalLikesForDiscussion(discussionId);
    return res.status(200).json({ totalLikes });
}));
discussionsRouter.get('/:discussionId/likes/users', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const users = yield discussionsService_1.default.getUsersWhoLikedDiscussion(discussionId);
    return res.status(200).json({ users });
}));
discussionsRouter.get('/:discussionId/likes/check', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const hasLiked = yield discussionsService_1.default.hasUserLikedDiscussion(userId, discussionId);
    return res.status(200).json({ hasLiked });
}));
// bookmark / save service
discussionsRouter.post('/:discussionId/bookmark', middleware_1.default.checkPermission('ADD_BOOKMARK_TO_DISCUSSION'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const bookmark = yield discussionsService_1.default.addBookmark(userId, discussionId);
    return res.status(201).json(bookmark);
}));
discussionsRouter.delete('/:discussionId/bookmark', middleware_1.default.checkPermission('REMOVE_BOOKMARK_FROM_DISCUSSION'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const result = yield discussionsService_1.default.removeBookmark(userId, discussionId);
    return res.status(200).json(result);
}));
// comment functionality
discussionsRouter.post('/:discussionId/comment', middleware_1.default.checkPermission('COMMENT_DISCUSSION'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    const { content } = req.body;
    if (isNaN(discussionId) || discussionId <= 0) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    if (!content) {
        return res.status(400).json({ error: 'Comment content is required' });
    }
    if (typeof content !== 'string') {
        return res
            .status(400)
            .json({ error: 'Comment content must be a string' });
    }
    if (content.length < 3) {
        return res
            .status(400)
            .json({ error: 'Comment content must be at least 3 characters' });
    }
    if (content.length > 1000) {
        return res
            .status(400)
            .json({ error: 'Comment content cannot exceed 1000 characters' });
    }
    if (!/^[\p{L}\p{N}\s.,?!'"@#$%^&*()[\]{}\-_=+\\|;:<>/~`]*$/u.test(content)) {
        return res.status(400).json({
            error: 'Content can only contain letters, numbers, spaces, emojis, and common punctuation',
        });
    }
    const comment = yield discussionsService_1.default.addComment(userId, discussionId, content);
    return res.status(201).json(comment);
}));
discussionsRouter.get('/:discussionId/comments', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const discussionId = Number(req.params.discussionId);
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : 10;
    const sort = req.query.sort ? req.query.sort : 'recent';
    if (isNaN(discussionId) || discussionId <= 0) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const comments = yield discussionsService_1.default.getComments(discussionId, limit, cursor, sort);
    return res.status(200).json(comments);
}));
// report functionality
discussionsRouter.post('/:discussionId/report', middleware_1.default.checkPermission('REPORT_DISCUSSION'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    const { reportReason } = req.body;
    if (isNaN(discussionId)) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    if (!reportReason) {
        return res.status(400).json({ message: 'Report reason is required.' });
    }
    const newReport = yield discussionsService_1.default.addDiscussionReport(discussionId, userId, reportReason);
    return res.status(201).json(newReport);
}));
exports.default = discussionsRouter;
