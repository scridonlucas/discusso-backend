import { Sequelize } from 'sequelize-typescript';
import config from '../utils/config';

const { DATABASE_URL } = config;
const sequelize = new Sequelize(
  DATABASE_URL ??
    'postgres://txkryedz:KOYssVuxusTX7lV9aIMIzYnkQeMg3oDt@tai.db.elephantsql.com/txkryedz'
);

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Unable to connect to the database: ${error.message}`);
    }
  }
};

export default dbConnect;
