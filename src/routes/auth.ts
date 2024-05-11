import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import middleware from '../utils/middleware';
import { CustomRequest } from '../types/types';

const authRouter = Router();

authRouter.get('/', middleware.jwtVerify, ((req: CustomRequest, res) => {
  const decodedToken = req.user;
  res.json({ decodedToken });
}) as RequestHandler);

export default authRouter;
