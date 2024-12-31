import axios from 'axios';
import prisma from '../utils/prismaClient';
import { CustomAPIError, CustomStocksError } from '../utils/customErrors';

interface SymbolSearchResult {
  bestMatches: Array<{
    '1. symbol': string;
    '2. name': string;
    '3. type': string;
    '4. region': string;
    '5. marketOpen': string;
    '6. marketClose': string;
    '7. timezone': string;
    '8. currency': string;
    '9. matchScore': string;
  }>;
}

interface GlobalQuoteResult {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

if (!ALPHA_VANTAGE_API_KEY) {
  throw new CustomAPIError('ALPHA_VANTAGE_API_KEY is not defined');
}
const STOCK_URL = (symbol: string) =>
  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

const SYMBOL_SEARCH_URL = (symbol: string) =>
  `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

const getFavoriteStoredStocks = async (userId: number) => {
  const favoriteStocks = await prisma.favoriteStock.findMany({
    where: {
      userId,
    },
  });

  return favoriteStocks;
};
const addFavoriteStock = async (userId: number, ticker: string) => {
  const stockDetails = await validateTicker(ticker);

  if (!stockDetails) {
    throw new CustomStocksError('Invalid ticker symbol');
  }

  const existingFavorite = await prisma.favoriteStock.findUnique({
    where: {
      userId_ticker: {
        userId,
        ticker,
      },
    },
  });

  if (existingFavorite) {
    throw new CustomStocksError('Stock is already in your favorites');
  }

  const favoriteStock = await prisma.favoriteStock.create({
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
};

const deleteFavoriteStock = async (stockId: number) => {
  const existingFavorite = await prisma.favoriteStock.findUnique({
    where: {
      id: stockId,
    },
  });

  if (!existingFavorite) {
    throw new CustomStocksError('Stock is not in your favorites');
  }

  const deletedFavoriteStock = await prisma.favoriteStock.delete({
    where: {
      id: stockId,
    },
  });

  return deletedFavoriteStock;
};

const getFavoriteStocksWithDetails = async (userId: number) => {
  const favoriteStocks = await prisma.favoriteStock.findMany({
    where: {
      userId,
    },
  });

  if (favoriteStocks.length === 0) {
    return [];
  }

  try {
    const detailedStocks = await Promise.all(
      favoriteStocks.map(async (stock) => {
        try {
          const realTimeDetails = await fetchStockDetails(stock.ticker);
          return {
            ...stock,
            open: realTimeDetails.open,
            high: realTimeDetails.high,
            low: realTimeDetails.low,
            price: realTimeDetails.price,
            volume: realTimeDetails.volume,
            change: realTimeDetails.change,
            changePercent: realTimeDetails.changePercent,
          };
        } catch (error) {
          return {
            ...stock,
            open: null,
            high: null,
            low: null,
            price: null,
            volume: null,
            change: null,
            changePercent: null,
          };
        }
      })
    );

    return detailedStocks;
  } catch (error) {
    throw new CustomAPIError('Failed to fetch favorite stocks with details');
  }
};

// helper functions
const validateTicker = async (ticker: string) => {
  try {
    const response = await axios.get<SymbolSearchResult>(
      SYMBOL_SEARCH_URL(ticker)
    );
    if (!response.data.bestMatches || response.data.bestMatches.length === 0) {
      throw new CustomAPIError(
        'Failed to fetch stock details from Alpha Vantage'
      );
    }

    const match = response.data.bestMatches.find(
      (match) => match['1. symbol'].toUpperCase() === ticker.toUpperCase()
    );

    if (!match) {
      throw new CustomStocksError('Invalid ticker symbol');
    }

    const stockDetails = {
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency'],
    };

    return stockDetails;
  } catch (error) {
    throw new CustomAPIError(
      'Failed to fetch stock details from Alpha Vantage'
    );
  }
};

const fetchStockDetails = async (ticker: string) => {
  try {
    const response = await axios.get<GlobalQuoteResult>(STOCK_URL(ticker));
    const data = response.data['Global Quote'];
    if (!data || !data['01. symbol']) {
      throw new CustomAPIError('Invalid response from stock API');
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
  } catch (error) {
    throw new CustomAPIError('Failed to fetch stock details');
  }
};

export default {
  addFavoriteStock,
  deleteFavoriteStock,
  getFavoriteStoredStocks,
  getFavoriteStocksWithDetails,
};
