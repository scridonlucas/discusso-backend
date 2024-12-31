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
const getReportedComments = (limit, cursor, status) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        status: status,
    };
    const commentReports = yield prismaClient_1.default.commentReport.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        where,
        include: {
            user: { select: { id: true, username: true } },
            comment: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    userId: true,
                    user: true,
                },
            },
        },
    });
    const total = yield prismaClient_1.default.commentReport.count({ where });
    return {
        commentReports,
        nextCursor: commentReports.length === limit
            ? commentReports[commentReports.length - 1].id
            : null,
        total,
    };
});
const getCommentReportsCount = (status) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        status: status,
    };
    const count = yield prismaClient_1.default.commentReport.count({ where });
    return count;
});
const getCommentReportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const commentReport = yield prismaClient_1.default.commentReport.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, username: true } },
            comment: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    userId: true,
                    discussionId: true,
                },
            },
        },
    });
    if (!commentReport) {
        throw new customErrors_1.CustomReportError('Comment report not found');
    }
    return commentReport;
});
const updateCommentReportStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const commentReport = yield prismaClient_1.default.commentReport.update({
        where: { id: id },
        data: { status: status, reviewedAt: new Date() },
    });
    return commentReport;
});
const closeCommentReport = (adminId, reportId, action) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingReport = yield tx.commentReport.findUnique({
            where: { id: reportId },
            select: {
                status: true,
                commentId: true,
                reason: true,
                comment: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        if (!existingReport || existingReport.status !== 'PENDING') {
            throw new customErrors_1.CustomReportError('This ticket is already closed.');
        }
        const updatedReport = yield tx.commentReport.update({
            where: { id: reportId },
            data: {
                status: action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED',
                reviewedAt: new Date(),
                notes: existingReport.reason,
            },
        });
        if (action === 'REMOVE_RESOURCE' || action === 'REMOVE_AND_BAN') {
            yield tx.comment.update({
                where: { id: existingReport.commentId },
                data: { isDeleted: true },
            });
        }
        if (action === 'REMOVE_AND_BAN') {
            yield tx.user.update({
                where: { id: existingReport.comment.userId },
                data: { status: 'BANNED' },
            });
        }
        yield tx.moderationLog.create({
            data: {
                adminId,
                userId: existingReport.comment.userId,
                action,
                targetId: existingReport.commentId,
            },
        });
        return updatedReport;
    }));
});
exports.default = {
    getReportedComments,
    getCommentReportById,
    updateCommentReportStatus,
    closeCommentReport,
    getCommentReportsCount,
};
