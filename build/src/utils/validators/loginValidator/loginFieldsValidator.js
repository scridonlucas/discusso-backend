"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeValidators_1 = __importDefault(require("../typeValidators"));
const emailValidator = (input) => {
    if (!typeValidators_1.default.isString(input)) {
        throw new Error('Incorrect type');
    }
    return input;
};
const passwordValidator = (input) => {
    if (!typeValidators_1.default.isString(input)) {
        throw new Error('Incorrect type');
    }
    return input;
};
exports.default = {
    emailValidator,
    passwordValidator,
};
