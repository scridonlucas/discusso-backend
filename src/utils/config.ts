import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: Number(process.env.PORT),
  DATABASE_URL: process.env.DB,
};
