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
const express_1 = require("express");
const commentReportsService_1 = __importDefault(require("../services/commentReportsService"));
const commentReportsRouter = (0, express_1.Router)();
commentReportsRouter.get('/', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_COMMENT_REPORTS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const status = req.query.status ? req.query.status : 'PENDING';
    const commentReports = yield commentReportsService_1.default.getReportedComments(limit, cursor, status);
    return res.status(200).json(commentReports);
}));
commentReportsRouter.get('/count', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_COMMENT_REPORTS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.query.status;
    const count = yield commentReportsService_1.default.getCommentReportsCount(status);
    return res.status(200).json(count);
}));
commentReportsRouter.get('/:commentId', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_COMMENT_REPORTS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = Number(req.params.commentId);
    if (isNaN(commentId)) {
        return res.status(400).json({ error: 'Invalid comment ID' });
    }
    const commentReport = yield commentReportsService_1.default.getCommentReportById(commentId);
    return res.status(200).json(commentReport);
}));
commentReportsRouter.patch('/:discussionId', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('CHANGE_COMMENT_REPORT_STATUS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = Number(req.params.commentId);
    const status = req.body.status;
    if (isNaN(commentId) || commentId <= 0) {
        return res.status(400).json({ error: 'Invalid comment ID' });
    }
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }
    const commentReport = yield commentReportsService_1.default.updateCommentReportStatus(commentId, status);
    return res.status(200).json({ commentReport });
}));
commentReportsRouter.post('/:reportId/close', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('CLOSE_TICKET'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.decodedToken.id;
    const reportId = Number(req.params.reportId);
    const { action } = req.body;
    if (isNaN(adminId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!reportId || !action) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['DISMISS', 'REMOVE_RESOURCE', 'REMOVE_AND_BAN'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
    }
    const commentReport = yield commentReportsService_1.default.closeCommentReport(adminId, reportId, action);
    return res.status(200).json(commentReport);
}));
exports.default = commentReportsRouter;
