import express from 'express';
import 'express-async-errors';
import middleware from '../utils/middleware';
import { Request, Response } from 'express';
import stocksService from '../services/stocksService';
const stocksRouter = express.Router();

stocksRouter.get(
  '/favourites/stored',
  middleware.checkPermission('MANAGE_STOCKS'),
  async (req: Request, res: Response) => {
    const userId = req.decodedToken.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const stockList = await stocksService.getFavoriteStoredStocks(userId);

    return res.status(200).json(stockList);
  }
);

stocksRouter.get(
  '/favourites/real-time',
  middleware.checkPermission('MANAGE_STOCKS'),
  async (req: Request, res: Response) => {
    const userId = req.decodedToken.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const stockList = await stocksService.getFavoriteStocksWithDetails(userId);
    return res.status(200).json(stockList);
  }
);

stocksRouter.post(
  '/favourites',
  middleware.checkPermission('MANAGE_STOCKS'),
  async (
    req: Request<unknown, unknown, { ticker: string }, unknown>,
    res: Response
  ) => {
    const userId = req.decodedToken.id;
    const { ticker } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!ticker) {
      return res.status(400).json({ error: 'Ticker is required' });
    }

    const stockData = await stocksService.addFavoriteStock(userId, ticker);

    return res.status(200).json(stockData);
  }
);

stocksRouter.delete(
  '/favourites/:stockId',
  middleware.checkPermission('MANAGE_STOCKS'),
  async (req: Request, res: Response) => {
    const userId = req.decodedToken.id;
    const stockId = Number(req.params.stockId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!stockId || isNaN(stockId)) {
      return res.status(400).json({ error: 'Ticker is required' });
    }

    const deletedStockData = await stocksService.deleteFavoriteStock(stockId);

    return res.status(200).json(deletedStockData);
  }
);

export default stocksRouter;
