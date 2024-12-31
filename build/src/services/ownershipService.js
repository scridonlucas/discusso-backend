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
const customErrors_1 = require("../utils/customErrors");
function isOwner(resourceType, userId, resourceId) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (resourceType) {
            case 'discussion':
                const discussion = yield prismaClient_1.default.discussion.findUnique({
                    where: { id: resourceId },
                    select: { userId: true },
                });
                if (!discussion) {
                    throw new customErrors_1.CustomPermissionError('Discussion not found');
                }
                return discussion.userId === userId;
            case 'user':
                const user = yield prismaClient_1.default.user.findUnique({
                    where: { id: resourceId },
                    select: { id: true },
                });
                if (!user) {
                    throw new customErrors_1.CustomPermissionError('User not found');
                }
                return user.id === userId;
            default:
                throw new customErrors_1.CustomPermissionError(`Unsupported resource type: ${resourceType}`);
        }
    });
}
exports.default = {
    isOwner,
};
