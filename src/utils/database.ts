import { Sequelize } from 'sequelize';

import config from './config';

const { DATABASE_URL } = config;
console.log(DATABASE_URL);
const sequelize = new Sequelize(
  'postgres://txkryedz:KOYssVuxusTX7lV9aIMIzYnkQeMg3oDt@tai.db.elephantsql.com/txkryedz'
);

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Unable to connect to the database: ${error.message}`);
      return process.exit(1);
    }
  }
};

export default { sequelize, dbConnect };
