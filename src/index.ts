import 'express-async-errors';
import app from './app';
import config from './utils/config';

const { PORT } = config;

const start = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
void start();
