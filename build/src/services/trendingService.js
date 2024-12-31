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
exports.updateTrendingScores = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const computeTrendingScore_1 = require("../utils/computeTrendingScore");
function updateTrendingScores() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const discussions = yield prismaClient_1.default.discussion.findMany({
                where: { isDeleted: false },
                include: {
                    _count: { select: { likes: true, comments: true, bookmarks: true } },
                },
            });
            const now = new Date();
            const updates = discussions.map((discussion) => {
                const hoursSinceCreation = (now.getTime() - new Date(discussion.createdAt).getTime()) /
                    (1000 * 60 * 60);
                const trendingScore = (0, computeTrendingScore_1.computeTrendingScore)(discussion._count.likes || 0, discussion._count.comments || 0, discussion._count.bookmarks || 0, hoursSinceCreation);
                return prismaClient_1.default.discussion.update({
                    where: { id: discussion.id },
                    data: { trendingScore },
                });
            });
            yield Promise.all(updates);
            console.log('Trending scores updated successfully!');
        }
        catch (error) {
            console.error('Error updating trending scores:', error);
        }
    });
}
exports.updateTrendingScores = updateTrendingScores;
