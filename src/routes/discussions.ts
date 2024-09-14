import 'express-async-errors';
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
  async (
    req: Request<unknown, unknown, NewDiscussion>,
    res: Response,
    _next
  ) => {
    const userId = req.decodedToken.id;

    const { title, content, communityId } = req.body;

    if (!title || !content || !communityId) {
      return res
        .status(400)
        .json({ error: 'Title, content, and communityId are required' });
    }

    if (typeof communityId !== 'number' || communityId <= 0) {
      return res
        .status(400)
        .json({ error: 'communityId must be a positive number' });
    }

    if (title.length < 3) {
      return res
        .status(400)
        .json({ error: 'Title must be at least 3 characters long' });
    }

    if (title.length > 300) {
      return res
        .status(400)
        .json({ error: 'Title cannot exceed 300 characters' });
    }

    if (content.length < 20) {
      return res
        .status(400)
        .json({ error: 'Content should contain at least 20 characters' });
    }

    if (content.length > 1000) {
      return res
        .status(400)
        .json({ error: 'Content cannot exceed 1000 characters' });
    }

    if (!/^[A-Za-z0-9\s]+$/.test(title)) {
      return res.status(400).json({
        error: 'Title can only contain letters, numbers, and spaces',
      });
    }

    if (!/^[A-Za-z0-9\s.,?!'"@#$%^&*()[\]{}\-_=+\\|;:<>/~`]+$/.test(content)) {
      return res.status(400).json({
        error:
          'Content can only contain letters, numbers, and common punctuation',
      });
    }

    const discussion = await discussionsService.addDiscussion(
      { title, content, communityId },
      userId
    );

    return res.status(201).json(discussion);
  }
);

discussionsRouter.get(
  '/',
  middleware.jwtVerify,
  async (
    req: Request<unknown, unknown, NewDiscussion, PaginationQuery>,
    res: Response,
    _next
  ) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const discussions = await discussionsService.getDiscussions(limit, offset);

    return res.status(201).json(discussions);
  }
);

discussionsRouter.get(
  '/users/:userId/discussions',
  middleware.jwtVerify,
  async (
    req: Request<
      { [key: string]: string },
      unknown,
      NewDiscussion,
      PaginationQuery
    >,
    res: Response,
    _next
  ) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;

    const discussions = await discussionsService.getDiscussionsByUser(
      userId,
      limit,
      offset
    );

    return res.status(201).json(discussions);
  }
);
discussionsRouter.get(
  '/users/:communityId/discussions',
  middleware.jwtVerify,
  async (
    req: Request<
      { [key: string]: string },
      unknown,
      NewDiscussion,
      PaginationQuery
    >,
    res: Response,
    _next
  ) => {
    const communityId = Number(req.params.communityId);

    if (isNaN(communityId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;

    const discussions = await discussionsService.getDiscussionsByCommunity(
      communityId,
      limit,
      offset
    );

    return res.status(201).json(discussions);
  }
);

discussionsRouter.post(
  '/:discussionId',
  middleware.jwtVerify,
  async (req, res, _next) => {
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const discussion = await discussionsService.getDiscussionById(discussionId);

    return res.status(200).json(discussion);
  }
);

discussionsRouter.delete(
  '/:discussionId',
  middleware.jwtVerify,
  async (req, res, _next) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const deletedDiscussion = await discussionsService.deleteDiscussion(
      discussionId,
      userId
    );

    return res.status(200).json(deletedDiscussion);
  }
);

// likes functionality
discussionsRouter.post(
  '/:discussionId/like',
  middleware.jwtVerify,
  async (req, res, _next) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const like = await discussionsService.addLike(userId, discussionId);

    return res.status(201).json(like);
  }
);

discussionsRouter.delete(
  '/:discussionId/like',
  middleware.jwtVerify,
  async (req, res, _next) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const removedLike = await discussionsService.deleteLike(
      userId,
      discussionId
    );

    return res.status(200).json(removedLike);
  }
);

discussionsRouter.get(
  '/:discussionId/likes/count',
  middleware.jwtVerify,
  async (req, res, _next) => {
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const totalLikes = await discussionsService.getTotalLikesForDiscussion(
      discussionId
    );

    return res.status(200).json({ totalLikes });
  }
);

discussionsRouter.get(
  '/:discussionId/likes/users',
  middleware.jwtVerify,
  async (req, res, _next) => {
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const users = await discussionsService.getUsersWhoLikedDiscussion(
      discussionId
    );

    return res.status(200).json({ users });
  }
);

discussionsRouter.get(
  '/:discussionId/likes/check',
  middleware.jwtVerify,
  async (req, res, _next) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const hasLiked = await discussionsService.hasUserLikedDiscussion(
      userId,
      discussionId
    );

    return res.status(200).json({ hasLiked });
  }
);

export default discussionsRouter;
