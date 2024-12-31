"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookiesFieldsValidator_1 = __importDefault(require("./cookiesFieldsValidator"));
const customErrors_1 = require("../../customErrors");
const toNewCookie = (object) => {
    if (!object || typeof object !== 'object') {
        throw new customErrors_1.CustomTokenError('Missing cookies!');
    }
    if ('token' in object) {
        const newCookies = {
            token: cookiesFieldsValidator_1.default.tokenValidator(object.token),
        };
        return newCookies;
    }
    throw new customErrors_1.CustomTokenError('Token is missing!');
};
exports.default = toNewCookie;
