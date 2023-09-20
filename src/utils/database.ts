import { Sequelize } from 'sequelize-typescript';
import config from './config';

const { DATABASE_URL } = config;
const sequelize = new Sequelize(DATABASE_URL);

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
