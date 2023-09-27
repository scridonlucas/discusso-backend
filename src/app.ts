import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users';
import middleware from './utils/middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

export default app;
