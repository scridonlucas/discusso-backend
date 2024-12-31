import dotenv from 'dotenv';
dotenv.config();

try {
  if (!process.env.POSTGRES_DB_URL) {
    throw new Error(
      'POSTGRES_DB_URL is not defined in the environment variables.'
    );
  }

  if (!process.env.ALPHA_VANTAGE_API_KEY) {
    throw new Error(
      'ALPHA_VANTAGE_API_KEY is not defined in the environment variables.'
    );
  }
} catch (error) {
  if (error instanceof Error) {
    console.error('Configuration Error:', error.message);
  }
  process.exit(1);
}

export default {
  PORT: Number(process.env.PORT) ?? 3001,
  POSTGRES_DB_URL: process.env.POSTGRES_DB_URL,
  JWT: process.env.JWT ?? 'jwttoken',
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
};
