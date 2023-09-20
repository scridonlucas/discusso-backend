import app from './app';
import config from './utils/config';
import database from './utils/database';

const { dbConnect } = database;
const { PORT } = config;

const start = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
void start();
