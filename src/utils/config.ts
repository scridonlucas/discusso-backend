import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: Number(process.env.PORT) ?? 3001,
  DATABASE_URL:
    process.env.DB ??
    'postgres://txkryedz:KOYssVuxusTX7lV9aIMIzYnkQeMg3oDt@tai.db.elephantsql.com/txkryedz',
  JWT: process.env.JWT ?? 'jwttoken',
};
