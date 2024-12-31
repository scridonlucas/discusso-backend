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
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
require("express-async-errors");
const cookiesValidator_1 = __importDefault(require("./validators/cookiesValidator"));
const customErrors_1 = require("./customErrors");
const permissionsService_1 = __importDefault(require("../services/permissionsService"));
const ownershipService_1 = __importDefault(require("../services/ownershipService"));
const usersService_1 = __importDefault(require("../services/usersService"));
const checkPermission = (permission) => {
    return (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.decodedToken.id;
            const hasPerm = yield permissionsService_1.default.hasPermission(userId, permission);
            if (!hasPerm) {
                throw new customErrors_1.CustomPermissionError('You do not have permission to perform this action');
            }
            return next();
        }
        catch (error) {
            next(error);
        }
    });
};
const checkPermissionWithOwnership = (resourceType, resourceIdParam, ownPermission, anyPermission) => {
    return (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.decodedToken.id;
            const resourceId = Number(req.params[resourceIdParam]);
            if (isNaN(resourceId)) {
                throw new customErrors_1.CustomPermissionError('Invalid resource ID');
            }
            const hasAnyPermission = yield permissionsService_1.default.hasPermission(userId, anyPermission);
            if (hasAnyPermission) {
                return next(); // if user has any permission, allow access
            }
            const hasOwnPermission = yield permissionsService_1.default.hasPermission(userId, ownPermission);
            if (!hasOwnPermission) {
                throw new customErrors_1.CustomPermissionError('You do not have permission to perform this action');
            }
            const isUserOwner = yield ownershipService_1.default.isOwner(resourceType, userId, resourceId);
            if (!isUserOwner) {
                throw new customErrors_1.CustomPermissionError('You do not own this resource');
            }
            return next();
        }
        catch (error) {
            next(error);
        }
    });
};
const jwtVerify = (req, _res, next) => {
    try {
        const cookies = cookiesValidator_1.default.toNewCookie(req.cookies);
        const token = cookies.token;
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.JWT);
        req.decodedToken = decodedToken;
        next();
    }
    catch (error) {
        next(error);
    }
};
const checkUserStatus = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.decodedToken.id;
        const user = yield usersService_1.default.getUser(userId, true);
        if (!user) {
            throw new customErrors_1.CustomUserStatusError('User not found.');
        }
        if (user.status === 'BANNED') {
            throw new customErrors_1.CustomUserStatusError('User is banned.');
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
const unknownEndPoint = (_req, res, _next) => {
    res.status(404).send({
        error: 'unknown endpoint',
    });
};
const errorHandler = (error, _req, res, next) => {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                error: `There is a unique constraint violation.`,
            });
        }
        return res.status(400).json({ error: `Prisma error: ${error.message}` });
    }
    if (error instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        return res
            .status(500)
            .json({ error: 'An unknown error occurred with Prisma.' });
    }
    if (error instanceof client_1.Prisma.PrismaClientRustPanicError) {
        return res
            .status(500)
            .json({ error: 'A panic occurred in the Prisma engine.' });
    }
    if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
        return res
            .status(500)
            .json({ error: 'Failed to initialize Prisma Client.' });
    }
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        return res
            .status(400)
            .json({ error: 'Validation error with Prisma Client.' });
    }
    if (error instanceof customErrors_1.CustomTokenError) {
        return res.status(401).json({ error: error.message });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
        });
    }
    if (error instanceof customErrors_1.CustomPermissionError) {
        return res.status(401).json({ error: error.message });
    }
    if (error instanceof customErrors_1.CustomDiscussionError) {
        return res.status(401).json({ error: error.message });
    }
    if (error instanceof customErrors_1.CustomUserStatusError) {
        return res.status(403).json({ error: error.message });
    }
    if (error instanceof customErrors_1.CustomReportError) {
        return res.status(401).json({ error: error.message });
    }
    if (error instanceof customErrors_1.CustomStocksError) {
        res.status(401).json({ error: error.message });
    }
    if (error instanceof customErrors_1.CustomAPIError) {
        res.status(502).json({ error: error.message });
    }
    return next(error);
};
exports.default = {
    unknownEndPoint,
    errorHandler,
    jwtVerify,
    checkPermission,
    checkPermissionWithOwnership,
    checkUserStatus,
};
