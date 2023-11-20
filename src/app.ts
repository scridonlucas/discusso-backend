import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import loginRouter from './routes/login';
import middleware from './utils/middleware';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

export default app;
