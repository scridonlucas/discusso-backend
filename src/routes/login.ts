import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const loginRouter = Router();

loginRouter.post('/', (async (_req, res) => {
  res.json('pong');
}) as RequestHandler);

export default loginRouter;
