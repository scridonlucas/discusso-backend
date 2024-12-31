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
const express_1 = require("express");
const middleware_1 = __importDefault(require("../utils/middleware"));
const moderationLogsService_1 = __importDefault(require("../services/moderationLogsService"));
const moderationLogsRouter = (0, express_1.Router)();
moderationLogsRouter.get('/', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_LOGS'), (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const moderationLogs = yield moderationLogsService_1.default.getModerationLogs();
    res.status(200).json(moderationLogs);
}));
moderationLogsRouter.post('/', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('CREATE_LOG'), (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.decodedToken.id;
    const { userId, action, targetId } = req.body;
    if (!action || !adminId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const moderationLog = yield moderationLogsService_1.default.addModerationLog(adminId, userId || null, action, targetId || null);
    return res.status(201).json(moderationLog);
}));
exports.default = moderationLogsRouter;
