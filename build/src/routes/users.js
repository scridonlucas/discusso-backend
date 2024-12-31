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
const userValidator_1 = __importDefault(require("../utils/validators/userValidator"));
const usersService_1 = __importDefault(require("../services/usersService"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const usersRouter = (0, express_1.Router)();
usersRouter.get('/', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_USERS'), (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield usersService_1.default.getUsers();
    res.status(200).json(users);
}));
usersRouter.get('/count', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_USERS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, startDate, endDate } = req.query;
    const decodedStartDate = decodeURIComponent(startDate || '');
    const decodedEndDate = decodeURIComponent(endDate || '');
    const userCount = yield usersService_1.default.getUserCount(status, decodedStartDate, decodedEndDate);
    res.status(200).json(userCount);
}));
usersRouter.get('/most-active', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_ADMIN_STATISTICS'), (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield usersService_1.default.getUsersWithMostDiscussions();
    return res.status(200).json(count);
}));
usersRouter.get('/most-followed', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_ADMIN_STATISTICS'), (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield usersService_1.default.getMostFollowedUsers();
    return res.status(200).json(count);
}));
usersRouter.get('/me', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_OWN_USER_DETAILS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const user = yield usersService_1.default.getUser(userId, true);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).send({ error: 'User not found!' });
    }
}));
usersRouter.get('/:userId/public', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_PUBLIC_USER_DETAILS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.userId);
    const user = yield usersService_1.default.getUser(id, false);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).send({ error: 'User not found!' });
    }
}));
usersRouter.get('/:userId', middleware_1.default.jwtVerify, middleware_1.default.checkPermissionWithOwnership('user', 'userId', 'GET_OWN_USER_DETAILS', 'GET_ANY_USER_DETAILS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.userId);
    const user = yield usersService_1.default.getUser(id, true);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).send({ error: 'User not found!' });
    }
}));
usersRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserEntry = userValidator_1.default.toNewUserEntry(req.body);
    const addedUser = yield usersService_1.default.addUser(newUserEntry);
    res.json(addedUser);
}));
usersRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const deletedUser = yield usersService_1.default.deleteUser(id);
    if (deletedUser) {
        res.status(204).end();
    }
    else {
        res.status(404).send({ error: 'User not found!' });
    }
}));
usersRouter.get('/check-username/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const user = yield usersService_1.default.getUserByUsername(username);
    if (user) {
        return res.json({ exists: true });
    }
    else {
        return res.json({ exists: false });
    }
}));
usersRouter.get('/check-email/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const user = yield usersService_1.default.getUserByEmail(email);
    if (user) {
        return res.json({ exists: true });
    }
    else {
        return res.json({ exists: false });
    }
}));
usersRouter.patch('/:userId/status', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('UPDATE_USER_STATUS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    const status = req.body.status;
    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }
    const updatedUser = yield usersService_1.default.updateUserStatus(userId, status);
    return res.status(200).json(updatedUser);
}));
usersRouter.patch('/:userId/role', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('UPDATE_USER_ROLE'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.userId);
    const roleName = req.body.roleName;
    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!roleName || !['USER', 'ADMIN'].includes(roleName)) {
        return res.status(400).json({ error: 'Role is required' });
    }
    const updatedUser = yield usersService_1.default.updateUserRole(userId, roleName);
    return res.status(200).json(updatedUser);
}));
usersRouter.post('/:userId/follow', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('FOLLOW_USER'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const followerId = req.decodedToken.id;
    const followeeId = Number(req.params.userId);
    if (isNaN(followeeId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const follow = yield usersService_1.default.followUser(followerId, followeeId);
    return res.status(201).json(follow);
}));
usersRouter.delete('/:userId/follow', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('FOLLOW_USER'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const followerId = req.decodedToken.id;
    const followeeId = Number(req.params.userId);
    if (isNaN(followeeId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const unfollow = yield usersService_1.default.unfollowUser(followerId, followeeId);
    return res.status(200).json(unfollow);
}));
exports.default = usersRouter;
