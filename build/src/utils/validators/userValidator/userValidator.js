"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userFieldsValidator_1 = __importDefault(require("./userFieldsValidator"));
const toNewUserEntry = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrent or missing data!');
    }
    if ('firstName' in object &&
        'lastName' in object &&
        'username' in object &&
        'email' in object &&
        'gender' in object &&
        'birthDate' in object &&
        'password' in object &&
        'confirmPassword' in object) {
        const password = userFieldsValidator_1.default.parsePassword(object.password);
        const confirmPassword = userFieldsValidator_1.default.parsePassword(object.confirmPassword);
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match.');
        }
        const newUser = {
            firstName: userFieldsValidator_1.default.parseName(object.firstName),
            lastName: userFieldsValidator_1.default.parseName(object.lastName),
            username: userFieldsValidator_1.default.parseUsername(object.username),
            status: 'ACTIVE',
            email: userFieldsValidator_1.default.parseEmail(object.email),
            gender: userFieldsValidator_1.default.parseGender(object.gender),
            birthDate: userFieldsValidator_1.default.parseBirthDate(object.birthDate),
            password: password,
        };
        return newUser;
    }
    throw new Error('Some fields are missing!');
};
exports.default = toNewUserEntry;
