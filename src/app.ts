import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import middleware from './utils/middleware';

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

export default app;
