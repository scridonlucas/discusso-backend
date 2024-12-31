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
require("express-async-errors");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./utils/config"));
const prismaClient_1 = __importDefault(require("./utils/prismaClient"));
const { PORT } = config_1.default;
const start = () => {
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
// close db connection
const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prismaClient_1.default.$disconnect();
        console.log('Disconnected from Prisma Client');
    }
    catch (err) {
        console.error('Error disconnecting from Prisma Client', err);
    }
    finally {
        process.exit(0);
    }
});
void start();
process.on('SIGINT', () => {
    void gracefulShutdown();
});
process.on('SIGTERM', () => {
    void gracefulShutdown();
});
