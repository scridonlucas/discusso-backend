import 'express-async-errors';
import { RequestHandler } from 'express';
import middleware from '../utils/middleware';
import { Response } from 'express';
import discussionsService from '../services/discussionsService';
import { Router, Request } from 'express';
import { NewDiscussion } from '../types/discussionType';

const discussionsRouter = Router();

discussionsRouter.post('/', middleware.jwtVerify, (async (
  req: Request<unknown, unknown, NewDiscussion>,
  res: Response,
  _next
) => {
  const userId = req.decodedToken.id;
  const newDiscussion = req.body;
  const discussion = await discussionsService.addDiscussion(
    newDiscussion,
    userId
  );
  res.status(201).json(discussion);
}) as RequestHandler);

discussionsRouter.get('/', middleware.jwtVerify, (async (
  req: Request<unknown, unknown, NewDiscussion>,
  res: Response,
  _next
) => {}) as RequestHandler);
export default discussionsRouter;
