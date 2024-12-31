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
const notificationService_1 = __importDefault(require("./notificationService"));
function addCommentLike(userId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingLike = yield prismaClient_1.default.commentLike.findUnique({
            where: {
                userId_commentId: { userId, commentId },
            },
        });
        if (existingLike) {
            throw new customErrors_1.CustomDiscussionError('User has already liked this comment');
        }
        const like = yield prismaClient_1.default.commentLike.create({
            data: {
                userId,
                commentId,
            },
            include: { user: { select: { id: true, username: true } } },
        });
        const comment = yield prismaClient_1.default.comment.findUnique({
            where: { id: commentId },
            select: { userId: true, user: true },
        });
        if (!comment) {
            throw new customErrors_1.CustomDiscussionError('Discussion not found');
        }
        yield notificationService_1.default.createNotification(comment.userId, 'COMMENT LIKE', `User ${comment.user.username} commented on your discussion #${commentId}`);
        return like;
    });
}
const removeCommentLike = (userId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLike = yield prismaClient_1.default.commentLike.findUnique({
        where: {
            userId_commentId: {
                userId,
                commentId,
            },
        },
    });
    if (!existingLike) {
        throw new customErrors_1.CustomDiscussionError('User has not liked this comment');
    }
    const removedLike = yield prismaClient_1.default.commentLike.delete({
        where: {
            userId_commentId: {
                userId,
                commentId,
            },
        },
    });
    return removedLike;
});
const addComentReport = (commentId, userId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPendingReport = yield prismaClient_1.default.commentReport.findFirst({
        where: {
            commentId,
            userId,
            status: 'PENDING',
        },
    });
    if (existingPendingReport) {
        throw new customErrors_1.CustomDiscussionError(`You have already reported this comment and it is currently under review.`);
    }
    const newReport = yield prismaClient_1.default.commentReport.create({
        data: {
            commentId,
            userId,
            reason,
        },
    });
    return newReport;
});
exports.default = { addCommentLike, removeCommentLike, addComentReport };
