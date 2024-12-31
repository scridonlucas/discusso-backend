"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
try {
    if (!process.env.POSTGRES_DB_URL) {
        throw new Error('POSTGRES_DB_URL is not defined in the environment variables.');
    }
    if (!process.env.ALPHA_VANTAGE_API_KEY) {
        throw new Error('ALPHA_VANTAGE_API_KEY is not defined in the environment variables.');
    }
}
catch (error) {
    if (error instanceof Error) {
        console.error('Configuration Error:', error.message);
    }
    process.exit(1);
}
exports.default = {
    PORT: (_a = Number(process.env.PORT)) !== null && _a !== void 0 ? _a : 3001,
    POSTGRES_DB_URL: process.env.POSTGRES_DB_URL,
    JWT: (_b = process.env.JWT) !== null && _b !== void 0 ? _b : 'jwttoken',
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
};
