import axios from 'axios';
import prisma from '../utils/prismaClient';
import { CustomAPIError } from '../utils/customErrors';

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
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

if (!ALPHA_VANTAGE_API_KEY) {
  throw new CustomAPIError('ALPHA_VANTAGE_API_KEY is not defined');
}

/*const STOCK_URL = (symbol: string) =>
  `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${ALPHA_VANTAGE_API_KEY}`;
*/

const SYMBOL_SEARCH_URL = (symbol: string) =>
  `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

const addFavoriteStock = async (userId: number, ticker: string) => {
  const isValid = await validateTicker(ticker);

  if (!isValid) {
    throw new CustomAPIError('Invalid ticker symbol');
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
    throw new CustomAPIError('Stock is already in your favorites');
  }

  const favoriteStock = await prisma.favoriteStock.create({
    data: {
      userId,
      ticker,
    },
  });

  return favoriteStock;
};

const validateTicker = async (ticker: string) => {
  try {
    const response = await axios.get<SymbolSearchResult>(
      SYMBOL_SEARCH_URL(ticker)
    );
    return response.data.bestMatches.some(
      (match) => match['1. symbol'].toUpperCase() === ticker.toUpperCase()
    );
  } catch (error) {
    throw new CustomAPIError('Invalid ticker symbol');
  }
};

export default { addFavoriteStock };
