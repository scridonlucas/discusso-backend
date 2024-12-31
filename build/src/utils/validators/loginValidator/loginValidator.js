"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginFieldsValidator_1 = __importDefault(require("./loginFieldsValidator"));
const toNewLoginEntry = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrent or missing data!');
    }
    if ('email' in object && 'password' in object) {
        const newLoginEntry = {
            email: loginFieldsValidator_1.default.emailValidator(object.email),
            password: loginFieldsValidator_1.default.passwordValidator(object.password),
        };
        return newLoginEntry;
    }
    throw new Error('Some fields are missing');
};
exports.default = toNewLoginEntry;
