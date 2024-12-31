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
const discussionReportsService_1 = __importDefault(require("../services/discussionReportsService"));
const discussionReportsRouter = (0, express_1.Router)();
discussionReportsRouter.get('/', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_DISCUSSION_REPORTS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const status = req.query.status ? req.query.status : 'PENDING';
    const discussionReports = yield discussionReportsService_1.default.getDiscussionReports(limit, cursor, status);
    return res.status(200).json(discussionReports);
}));
discussionReportsRouter.get('/count', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_DISCUSSION_REPORTS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.query.status;
    const discussionReportsCount = yield discussionReportsService_1.default.getDiscussionReportsCount(status);
    return res.status(200).json(discussionReportsCount);
}));
discussionReportsRouter.get('/:reportId', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_DISCUSSION_REPORTS'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = Number(req.params.reportId);
    if (isNaN(reportId) || reportId <= 0) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    const discussionReport = yield discussionReportsService_1.default.getDiscussionReportById(reportId);
    return res.status(200).json(discussionReport);
}));
discussionReportsRouter.patch('/:reportId', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('CHANGE_DISCUSSION_REPORT_STATUS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = Number(req.params.reportId);
    const status = req.body.status;
    if (isNaN(reportId) || reportId <= 0) {
        return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }
    const discussionReport = yield discussionReportsService_1.default.updateDiscussionReportStatus(reportId, status);
    return res.status(200).json(discussionReport);
}));
discussionReportsRouter.post('/:reportId/close', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('CLOSE_TICKET'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const discussionReport = yield discussionReportsService_1.default.closeDiscussionReport(adminId, reportId, action);
    return res.status(200).json(discussionReport);
}));
exports.default = discussionReportsRouter;
