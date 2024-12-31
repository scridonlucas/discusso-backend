"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeValidators_1 = __importDefault(require("../typeValidators"));
const parseName = (name) => {
    if (!typeValidators_1.default.isString(name)) {
        throw new Error('Incorrect first name type');
    }
    if (!/^[A-Za-z]+$/.test(name)) {
        throw new Error('Name should only contain letters (alphabetic characters)');
    }
    if (name.length < 3 || name.length > 30) {
        throw new Error('Both the first and last names should be between 3 and 30 characters in length."');
    }
    return name;
};
const parseUsername = (username) => {
    if (!typeValidators_1.default.isString(username)) {
        throw new Error('Incorrect username type');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
    }
    if (username.length < 3 || username.length > 16) {
        throw new Error('Both the first and last names should be between 3 and 16 characters in length."');
    }
    return username;
};
const parseEmail = (email) => {
    if (!typeValidators_1.default.isString(email)) {
        throw new Error('Incorrect email type');
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
        throw new Error('Invalid email address format');
    }
    return email;
};
const parseGender = (gender) => {
    if (!typeValidators_1.default.isString(gender) || !typeValidators_1.default.isGender(gender)) {
        throw new Error('Incorrect gender type/format');
    }
    return gender;
};
const parseStatus = (status) => {
    if (!typeValidators_1.default.isString(status) || !typeValidators_1.default.isStatus(status)) {
        throw new Error('Incorrect status type/format');
    }
    return status;
};
const parseBirthDate = (birthDate) => {
    if (!typeValidators_1.default.isString(birthDate) ||
        !typeValidators_1.default.isDate(birthDate)) {
        throw new Error('Incorrect date format');
    }
    return new Date(birthDate);
};
const parsePassword = (password) => {
    if (!typeValidators_1.default.isString(password)) {
        throw new Error('Incorrect password type');
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
    if (password.length < 8 || password.length > 16) {
        throw new Error('Password should be between 8 and 16 characters in length."');
    }
    return password;
};
exports.default = {
    parseName,
    parseUsername,
    parseStatus,
    parseEmail,
    parseGender,
    parseBirthDate,
    parsePassword,
};
