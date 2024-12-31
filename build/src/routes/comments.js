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
const commentsService_1 = __importDefault(require("../services/commentsService"));
const express_1 = require("express");
const commentsRouter = (0, express_1.Router)();
commentsRouter.post('/comments/:commentId/like', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('LIKE_COMMENT'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const commentId = Number(req.params.commentId);
    if (isNaN(commentId) || commentId <= 0) {
        return res.status(400).json({ error: 'Invalid comment ID' });
    }
    const like = yield commentsService_1.default.addCommentLike(userId, commentId);
    return res.status(201).json(like);
}));
commentsRouter.delete('/comments/:commentId/like', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('REMOVE_LIKE_FROM_COMMENT'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const commentId = Number(req.params.commentId);
    if (isNaN(commentId) || commentId <= 0) {
        return res.status(400).json({ error: 'Invalid comment ID' });
    }
    const removedLike = yield commentsService_1.default.removeCommentLike(userId, commentId);
    return res.status(200).json(removedLike);
}));
commentsRouter.post('/comments/:commentId/report', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('REPORT_COMMENT'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const commentId = Number(req.params.commentId);
    const { reportReason } = req.body;
    if (isNaN(commentId) || commentId <= 0) {
        return res.status(400).json({ error: 'Invalid comment ID' });
    }
    if (!reportReason) {
        return res.status(400).json({ message: 'Report reason is required.' });
    }
    const newReport = yield commentsService_1.default.addComentReport(commentId, userId, reportReason);
    return res.status(201).json(newReport);
}));
exports.default = commentsRouter;
