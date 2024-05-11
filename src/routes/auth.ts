import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import middleware from '../utils/middleware';
import { CustomRequest } from '../types/types';
import { Response } from 'express';
const authRouter = Router();

authRouter.get('/', middleware.jwtVerify, ((
  _req: CustomRequest,
  res: Response,
  _next
) => {
  res.json({
    success: true,
  });
}) as RequestHandler);

export default authRouter;
