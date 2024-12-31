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
const axios_1 = __importDefault(require("axios"));
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const config_1 = __importDefault(require("../utils/config"));
const customErrors_1 = require("../utils/customErrors");
const ALPHA_VANTAGE_API_KEY = config_1.default.ALPHA_VANTAGE_API_KEY;
if (!ALPHA_VANTAGE_API_KEY) {
    throw new customErrors_1.CustomAPIError('ALPHA_VANTAGE_API_KEY is not defined');
}
const STOCK_URL = (symbol) => `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
const SYMBOL_SEARCH_URL = (symbol) => `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
const getFavoriteStoredStocks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const favoriteStocks = yield prismaClient_1.default.favoriteStock.findMany({
        where: {
            userId,
        },
    });
    return favoriteStocks;
});
const addFavoriteStock = (userId, ticker) => __awaiter(void 0, void 0, void 0, function* () {
    const stockDetails = yield validateTicker(ticker);
    if (!stockDetails) {
        throw new customErrors_1.CustomStocksError('Invalid ticker symbol');
    }
    const existingFavorite = yield prismaClient_1.default.favoriteStock.findUnique({
        where: {
            userId_ticker: {
                userId,
                ticker,
            },
        },
    });
    if (existingFavorite) {
        throw new customErrors_1.CustomStocksError('Stock is already in your favorites');
    }
    const favoriteStock = yield prismaClient_1.default.favoriteStock.create({
        data: {
            userId,
            ticker,
            name: stockDetails.name,
            region: stockDetails.region,
            type: stockDetails.type,
            currency: stockDetails.currency,
        },
    });
    return favoriteStock;
});
const deleteFavoriteStock = (stockId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFavorite = yield prismaClient_1.default.favoriteStock.findUnique({
        where: {
            id: stockId,
        },
    });
    if (!existingFavorite) {
        throw new customErrors_1.CustomStocksError('Stock is not in your favorites');
    }
    const deletedFavoriteStock = yield prismaClient_1.default.favoriteStock.delete({
        where: {
            id: stockId,
        },
    });
    return deletedFavoriteStock;
});
const getFavoriteStocksWithDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const favoriteStocks = yield prismaClient_1.default.favoriteStock.findMany({
        where: {
            userId,
        },
    });
    if (favoriteStocks.length === 0) {
        return [];
    }
    try {
        const detailedStocks = yield Promise.all(favoriteStocks.map((stock) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const realTimeDetails = yield fetchStockDetails(stock.ticker);
                return Object.assign(Object.assign({}, stock), { open: realTimeDetails.open, high: realTimeDetails.high, low: realTimeDetails.low, price: realTimeDetails.price, volume: realTimeDetails.volume, change: realTimeDetails.change, changePercent: realTimeDetails.changePercent });
            }
            catch (error) {
                return Object.assign(Object.assign({}, stock), { open: null, high: null, low: null, price: null, volume: null, change: null, changePercent: null });
            }
        })));
        return detailedStocks;
    }
    catch (error) {
        throw new customErrors_1.CustomAPIError('Failed to fetch favorite stocks with details');
    }
});
// helper functions
const validateTicker = (ticker) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(SYMBOL_SEARCH_URL(ticker));
        if (!response.data.bestMatches || response.data.bestMatches.length === 0) {
            throw new customErrors_1.CustomAPIError('Failed to fetch stock details from Alpha Vantage');
        }
        const match = response.data.bestMatches.find((match) => match['1. symbol'].toUpperCase() === ticker.toUpperCase());
        if (!match) {
            throw new customErrors_1.CustomStocksError('Invalid ticker symbol');
        }
        const stockDetails = {
            symbol: match['1. symbol'],
            name: match['2. name'],
            type: match['3. type'],
            region: match['4. region'],
            currency: match['8. currency'],
        };
        return stockDetails;
    }
    catch (error) {
        throw new customErrors_1.CustomAPIError('Failed to fetch stock details from Alpha Vantage');
    }
});
const fetchStockDetails = (ticker) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(STOCK_URL(ticker));
        const data = response.data['Global Quote'];
        if (!data || !data['01. symbol']) {
            throw new customErrors_1.CustomAPIError('Invalid response from stock API');
        }
        return {
            symbol: data['01. symbol'],
            open: parseFloat(data['02. open']),
            high: parseFloat(data['03. high']),
            low: parseFloat(data['04. low']),
            price: parseFloat(data['05. price']),
            volume: parseInt(data['06. volume'], 10),
            change: parseFloat(data['09. change']),
            changePercent: data['10. change percent'],
        };
    }
    catch (error) {
        throw new customErrors_1.CustomAPIError('Failed to fetch stock details');
    }
});
exports.default = {
    addFavoriteStock,
    deleteFavoriteStock,
    getFavoriteStoredStocks,
    getFavoriteStocksWithDetails,
};
