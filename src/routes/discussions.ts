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

    const { title, content, communityId } = req.body;

    if (!title || !content || !communityId) {
      res
        .status(400)
        .json({ error: 'Title, content, and communityId are required' });
    }

    if (title.length < 3) {
      res
        .status(400)
        .json({ error: 'Title must be at least 3 characters long' });
    }

    if (title.length > 300) {
      res.status(400).json({ error: 'Title cannot exceed 300 characters' });
    }

    if (content.length < 20) {
      res
        .status(400)
        .json({ error: 'Content should contain at least 20 characters' });
    }

    if (content.length > 1000) {
      res.status(400).json({ error: 'Content cannot exceed 1000 characters' });
    }

    if (!/^[A-Za-z0-9\s]+$/.test(title)) {
      res.status(400).json({
        error: 'Title can only contain letters, numbers, and spaces',
      });
    }

    if (/^[A-Za-z0-9\s.,?!'"@#$%^&*()[\]{}\-_=+\\|;:<>/~`]+$/.test(content)) {
      res.status(400).json({
        error:
          'Content can only contain letters, numbers, and common punctuation',
      });
    }

    const discussion = await discussionsService.addDiscussion(
      { title, content, communityId },
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
