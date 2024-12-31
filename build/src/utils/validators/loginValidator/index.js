"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loginValidator_1 = __importDefault(require("./loginValidator"));
exports.default = { toNewLoginEntry: loginValidator_1.default };
