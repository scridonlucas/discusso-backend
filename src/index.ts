import 'express-async-errors';
import app from './app';
import config from './utils/config';
import database from './utils/database';

const { dbConnect } = database;
const { PORT } = config;

const start = async () => {
  await dbConnect();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
void start();
