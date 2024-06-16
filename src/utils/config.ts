import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: Number(process.env.PORT) ?? 3001,
  POSTGRES_DB_URL: process.env.POSTGRES_DB_URL ?? '',
  JWT: process.env.JWT ?? 'jwttoken',
};
