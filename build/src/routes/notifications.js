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
const notificationService_1 = __importDefault(require("../services/notificationService"));
const notificationsRouter = (0, express_1.Router)();
notificationsRouter.get('/', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_OWN_NOTIFICATIONS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const notifications = yield notificationService_1.default.getUserNotifications(userId);
    if (!notifications) {
        return res.status(404).json({ error: 'Notifications not found' });
    }
    return res.status(200).json(notifications);
}));
notificationsRouter.get('/count', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_OWN_NOTIFICATIONS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const unreadCount = yield notificationService_1.default.getUnreadNotificationCount(userId);
    return res.status(200).json(unreadCount);
}));
notificationsRouter.patch('/read-all', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('UPDATE_OWN_NOTIFICATIONS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const notification = yield notificationService_1.default.markAllNotificationsAsRead(userId);
    return res.status(200).json(notification);
}));
notificationsRouter.patch('/:notificationId/read', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('UPDATE_OWN_NOTIFICATIONS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const notificationId = Number(req.params.notificationId);
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!notificationId || isNaN(notificationId)) {
        return res.status(400).json({ error: 'Invalid notification ID' });
    }
    const notification = yield notificationService_1.default.markNotificationAsRead(notificationId);
    return res.status(200).json(notification);
}));
exports.default = notificationsRouter;
