import 'express-async-errors';
import { RequestHandler } from 'express';
import middleware from '../utils/middleware';
import { Response } from 'express';
import discussionsService from '../services/discussionsService';
import { Router, Request } from 'express';
import { NewDiscussion } from '../types/discussionType';
import { PaginationQuery } from '../types/requestTypes';

const discussionsRouter = Router();

discussionsRouter.post(
  '/',
  middleware.jwtVerify,
  middleware.checkPermission('CREATE_DISCUSSION'),
  (async (
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
  }) as RequestHandler
);

discussionsRouter.get('/', middleware.jwtVerify, (async (
  req: Request<unknown, unknown, NewDiscussion, PaginationQuery>,
  res: Response,
  _next
) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
  const discussions = await discussionsService.getDiscussions(limit, offset);
  console.log(discussions);
  res.status(201).json(discussions);
}) as RequestHandler);
export default discussionsRouter;
