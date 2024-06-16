import 'express-async-errors';
import app from './app';
import config from './utils/config';
import prisma from './utils/prismaClient';

const { PORT } = config;

const start = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// close db connection
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log('Disconnected from Prisma Client');
  } catch (err) {
    console.error('Error disconnecting from Prisma Client', err);
  } finally {
    process.exit(0);
  }
};

void start();

process.on('SIGINT', () => {
  void gracefulShutdown();
});
process.on('SIGTERM', () => {
  void gracefulShutdown();
});
