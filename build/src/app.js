"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = require("./routes");
const scheduleTrendingJob_1 = require("./jobs/scheduleTrendingJob");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.static('dist'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', routes_1.authRouter);
app.use('/api/users', routes_1.usersRouter);
app.use('/api/discussions', middleware_1.default.jwtVerify, middleware_1.default.checkUserStatus, routes_1.discussionsRouter);
app.use('/api/notifications', routes_1.notificationsRouter);
app.use('/api/comments', routes_1.commentsRouter);
app.use('/api/discussion-reports', routes_1.discussionReportsRouter);
app.use('/api/comment-reports', routes_1.commentReportsRouter);
app.use('/api/communities', routes_1.communitiesRouter);
app.use('/api/moderation-logs', routes_1.moderationLogsRouter);
app.use('/api/stocks', middleware_1.default.jwtVerify, routes_1.stocksRouter);
app.use(middleware_1.default.unknownEndPoint);
app.use(middleware_1.default.errorHandler);
(0, scheduleTrendingJob_1.initializeTrendingScheduler)(); // background script that updates trending scores hourly
exports.default = app;
