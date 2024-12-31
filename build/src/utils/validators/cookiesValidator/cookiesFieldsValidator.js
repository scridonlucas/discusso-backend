"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeValidators_1 = __importDefault(require("../typeValidators"));
const customErrors_1 = require("../../customErrors");
const tokenValidator = (input) => {
    if (!typeValidators_1.default.isString(input)) {
        throw new customErrors_1.CustomTokenError('Incorrect type');
    }
    return input;
};
exports.default = {
    tokenValidator,
};
