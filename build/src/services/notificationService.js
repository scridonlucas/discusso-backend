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
const getUserNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield prismaClient_1.default.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: 'desc' },
    });
    return notifications;
});
const getUnreadNotificationCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prismaClient_1.default.notification.count({
        where: { userId, isRead: false },
    });
    return count;
});
const markNotificationAsRead = (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield prismaClient_1.default.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
    return notification;
});
const markAllNotificationsAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield prismaClient_1.default.notification.updateMany({
        where: { userId },
        data: { isRead: true },
    });
    return notifications;
});
const createNotification = (recipientUserId, type, content) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = prismaClient_1.default.notification.create({
        data: {
            userId: recipientUserId,
            type,
            content,
        },
    });
    return notification;
});
exports.default = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
};
