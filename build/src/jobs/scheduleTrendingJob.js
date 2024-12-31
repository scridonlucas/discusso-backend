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
exports.initializeTrendingScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const trendingService_1 = require("../services/trendingService");
function initializeTrendingScheduler() {
    // Schedule the task to run at minute 0 of every hour
    node_cron_1.default.schedule('0 * * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('Trending score scheduler initialized. Scores will be updated every hour.');
        try {
            yield (0, trendingService_1.updateTrendingScores)();
            console.log(`[${new Date().toISOString()}] Trending score update completed.`);
        }
        catch (error) {
            console.error(error);
        }
    }));
}
exports.initializeTrendingScheduler = initializeTrendingScheduler;
