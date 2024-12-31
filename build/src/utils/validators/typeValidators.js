"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isGender = (gender) => {
    return ['MALE', 'FEMALE', 'OTHER'].includes(gender);
};
const isStatus = (status) => {
    return ['ACTIVE', 'BANNED'].includes(status);
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
exports.default = { isString, isGender, isDate, isStatus };
