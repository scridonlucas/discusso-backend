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
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const middleware_1 = __importDefault(require("../utils/middleware"));
const stocksService_1 = __importDefault(require("../services/stocksService"));
const stocksRouter = express_1.default.Router();
stocksRouter.get('/favourites/stored', middleware_1.default.checkPermission('MANAGE_STOCKS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const stockList = yield stocksService_1.default.getFavoriteStoredStocks(userId);
    return res.status(200).json(stockList);
}));
stocksRouter.get('/favourites/real-time', middleware_1.default.checkPermission('MANAGE_STOCKS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const stockList = yield stocksService_1.default.getFavoriteStocksWithDetails(userId);
    return res.status(200).json(stockList);
}));
stocksRouter.post('/favourites', middleware_1.default.checkPermission('MANAGE_STOCKS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const { ticker } = req.body;
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!ticker) {
        return res.status(400).json({ error: 'Ticker is required' });
    }
    const stockData = yield stocksService_1.default.addFavoriteStock(userId, ticker);
    return res.status(200).json(stockData);
}));
stocksRouter.delete('/favourites/:stockId', middleware_1.default.checkPermission('MANAGE_STOCKS'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const stockId = Number(req.params.stockId);
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!stockId || isNaN(stockId)) {
        return res.status(400).json({ error: 'Ticker is required' });
    }
    const deletedStockData = yield stocksService_1.default.deleteFavoriteStock(stockId);
    return res.status(200).json(deletedStockData);
}));
exports.default = stocksRouter;
