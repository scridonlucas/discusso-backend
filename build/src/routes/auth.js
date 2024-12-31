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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginValidator_1 = __importDefault(require("../utils/validators/loginValidator"));
const usersService_1 = __importDefault(require("../services/usersService"));
const loginService_1 = __importDefault(require("../services/loginService"));
const config_1 = __importDefault(require("../utils/config"));
const usersService_2 = require("../services/usersService");
const authRouter = (0, express_1.Router)();
authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginValidator_1.default.toNewLoginEntry(req.body);
    const user = yield usersService_1.default.getUserByEmail(email);
    const passwordCorrect = yield loginService_1.default.comparePasswords(user, password);
    if (user && user.status === 'BANNED') {
        return res.status(403).json({ error: 'User is banned!' });
    }
    if (passwordCorrect && user && user.status === 'ACTIVE') {
        const userForToken = {
            username: user.username,
            id: user.id,
        };
        const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.JWT, {
            expiresIn: 60 * 60,
        });
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).send({
            success: true,
        });
    }
    return res.status(401).json({ error: 'Invalid username or password!' });
}));
authRouter.get('/logout', (_req, res, _next) => {
    res.clearCookie('token');
    res.status(200).json({ success: true });
});
authRouter.get('/verify', middleware_1.default.jwtVerify, middleware_1.default.checkUserStatus, (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.decodedToken.username;
    const userId = req.decodedToken.id;
    const user = yield (0, usersService_2.getUserWithRole)(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({
        success: true,
        user: {
            username: username,
            userId: userId,
            role: user.role.roleName,
        },
    });
}));
exports.default = authRouter;
