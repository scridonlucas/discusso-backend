import express from 'express';
import 'express-async-errors';
import middleware from '../utils/middleware';
import { Request, Response } from 'express';
import stocksService from '../services/stocksService';
const stocksRouter = express.Router();

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

    console.log(stockData);
    return res.status(200).json({});
  }
);

export default stocksRouter;
