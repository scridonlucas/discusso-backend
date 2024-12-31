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
const getDiscussionReports = (limit, cursor, status) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        status: status,
    };
    const discussionReports = yield prismaClient_1.default.discussionReport.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        where,
        include: {
            user: { select: { id: true, username: true, email: true } },
            discussion: {
                select: { id: true, title: true, content: true, createdAt: true },
            },
        },
    });
    const nextCursor = discussionReports.length === limit
        ? discussionReports[discussionReports.length - 1].id
        : null;
    const total = yield prismaClient_1.default.discussionReport.count({ where });
    return {
        discussionReports,
        nextCursor,
        total,
    };
});
const getDiscussionReportsCount = (status) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        status: status,
    };
    const total = yield prismaClient_1.default.discussionReport.count({ where });
    return total;
});
const getDiscussionReportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const discussionReport = yield prismaClient_1.default.discussionReport.findUnique({
        where: { id: id },
        include: {
            user: { select: { id: true, username: true, email: true } },
            discussion: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    userId: true,
                },
            },
        },
    });
    if (!discussionReport) {
        throw new customErrors_1.CustomReportError('Discussion report not found');
    }
    return discussionReport;
});
const updateDiscussionReportStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const discussionReport = yield prismaClient_1.default.discussionReport.update({
        where: { id: id },
        data: { status: status, reviewedAt: new Date() },
    });
    return discussionReport;
});
const closeDiscussionReport = (adminId, reportId, action) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingReport = yield tx.discussionReport.findUnique({
            where: { id: reportId },
            select: {
                status: true,
                discussionId: true,
                reason: true,
                discussion: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        if (!existingReport || existingReport.status !== 'PENDING') {
            throw new customErrors_1.CustomReportError('This ticket is already closed.');
        }
        const updatedReport = yield tx.discussionReport.update({
            where: { id: reportId },
            data: {
                status: action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED',
                reviewedAt: new Date(),
                notes: existingReport.reason,
            },
        });
        if (action === 'REMOVE_RESOURCE' || action === 'REMOVE_AND_BAN') {
            yield tx.discussion.update({
                where: { id: existingReport.discussionId },
                data: { isDeleted: true },
            });
        }
        if (action === 'REMOVE_AND_BAN') {
            yield tx.user.update({
                where: { id: existingReport.discussion.userId },
                data: { status: 'BANNED' },
            });
        }
        yield tx.moderationLog.create({
            data: {
                adminId,
                userId: existingReport.discussion.userId,
                action,
                targetId: existingReport.discussionId,
            },
        });
        return updatedReport;
    }));
});
exports.default = {
    getDiscussionReports,
    getDiscussionReportById,
    updateDiscussionReportStatus,
    closeDiscussionReport,
    getDiscussionReportsCount,
};
