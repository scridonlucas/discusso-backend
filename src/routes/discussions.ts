import 'express-async-errors';
import middleware from '../utils/middleware';
import discussionsService from '../services/discussionsService';
import { Router, Request, Response, NextFunction } from 'express';
import {
  NewDiscussion,
  UpdatedDiscussion,
  NewComment,
  ReportData,
} from '../types/discussionType';

import {
  DiscussionQueryParams,
  CommentQueryParams,
} from '../types/requestTypes';

const discussionsRouter = Router();

discussionsRouter.post(
  '/',
  middleware.checkPermission('CREATE_DISCUSSION'),
  async (
    req: Request<unknown, unknown, NewDiscussion>,
    res: Response,
    _next: NextFunction
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

    if (!/^[\p{L}\p{N}\s.,!?-]+$/u.test(title)) {
      return res.status(400).json({
        error: 'Title can only contain letters, numbers, and spaces',
      });
    }

    if (
      !/^[\p{L}\p{N}\p{Emoji}\s.,!?'"@#$%^&*()[\]{}\-_=+\\|;:<>/~`]+$/u.test(
        content
      )
    ) {
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
  '/count',
  middleware.jwtVerify,
  async (
    req: Request<
      unknown,
      unknown,
      unknown,
      { startDate?: string; endDate?: string }
    >,
    res: Response
  ) => {
    const { startDate, endDate } = req.query;

    const decodedStartDate = decodeURIComponent(startDate || '');
    const decodedEndDate = decodeURIComponent(endDate || '');

    const discussionsCount = await discussionsService.getDiscussionsCount(
      decodedStartDate,
      decodedEndDate
    );

    res.status(200).json(discussionsCount);
  }
);

discussionsRouter.get(
  '/',
  async (
    req: Request<
      { discussionId: string },
      unknown,
      unknown,
      DiscussionQueryParams
    >,
    res: Response,
    _next
  ) => {
    const userId = req.decodedToken.id;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const communityId = req.query.community_id
      ? parseInt(req.query.community_id, 10)
      : null;
    const feedType = req.query.feed_type ? req.query.feed_type : 'explore';
    const sort = req.query.sort ? req.query.sort : 'recent';
    const dateRange = req.query.date_range ? req.query.date_range : 'all';
    const saved = req.query.saved ? true : false;
    const search = req.query.search ? req.query.search : '';
    const discussions = await discussionsService.getDiscussions(
      userId,
      limit,
      cursor,
      communityId,
      feedType,
      sort,
      dateRange,
      saved,
      search
    );

    return res.status(200).json(discussions);
  }
);

discussionsRouter.get(
  '/daily-stats',
  middleware.checkPermission('GET_ADMIN_STATISTICS'),
  async (
    req: Request<
      unknown,
      unknown,
      unknown,
      { startDate?: string; endDate?: string }
    >,
    res: Response
  ) => {
    const { startDate, endDate } = req.query;

    const stats = await discussionsService.getDailyDiscussionsStats(
      startDate,
      endDate
    );

    return res.json(stats);
  }
);

discussionsRouter.get(
  '/trending',
  async (_req: Request, res: Response, _next) => {
    const discussions = await discussionsService.getTrendingDiscussions();

    return res.status(200).json(discussions);
  }
);

discussionsRouter.get(
  '/users/:userId/discussions',
  async (
    req: Request<
      { [key: string]: string },
      unknown,
      NewDiscussion,
      DiscussionQueryParams
    >,
    res: Response,
    _next
  ) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;

    const discussions = await discussionsService.getDiscussionsByUser(
      userId,
      limit,
      cursor
    );

    return res.status(200).json(discussions);
  }
);
discussionsRouter.get(
  '/users/:communityId/discussions',
  async (
    req: Request<
      { [key: string]: string },
      unknown,
      NewDiscussion,
      DiscussionQueryParams
    >,
    res: Response,
    _next
  ) => {
    const communityId = Number(req.params.communityId);

    if (isNaN(communityId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;

    const discussions = await discussionsService.getDiscussionsByCommunity(
      communityId,
      limit,
      cursor
    );

    return res.status(200).json(discussions);
  }
);

discussionsRouter.get('/:discussionId', async (req, res, _next) => {
  const discussionId = Number(req.params.discussionId);

  if (isNaN(discussionId)) {
    return res.status(400).json({ error: 'Invalid discussion ID' });
  }

  const discussion = await discussionsService.getDiscussionById(discussionId);

  return res.status(200).json(discussion);
});

discussionsRouter.delete(
  '/:discussionId',
  middleware.checkPermissionWithOwnership(
    'discussion',
    'discussionId',
    'DELETE_OWN_DISCUSSION',
    'DELETE_ANY_DISCUSSION'
  ),
  async (req, res, _next) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const deletedDiscussion = await discussionsService.softDeleteDiscussion(
      discussionId,
      userId
    );

    return res.status(200).json(deletedDiscussion);
  }
);

discussionsRouter.put(
  '/:discussionId',
  middleware.checkPermissionWithOwnership(
    'discussion',
    'discussionId',
    'UPDATE_OWN_DISCUSSION',
    'UPDATE_ANY_DISCUSSION'
  ),
  async (
    req: Request<
      { [key: string]: string },
      unknown,
      UpdatedDiscussion,
      DiscussionQueryParams
    >,
    res: Response,
    _next
  ) => {
    const discussionId = Number(req.params.discussionId);
    const userId = req.decodedToken.id;

    const { title, content } = req.body;

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    if (!title && !content) {
      return res.status(400).json({
        error: 'At least one of title or content must be provided.',
      });
    }

    if (title !== undefined) {
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

      if (!/^[A-Za-z0-9\s]+$/.test(title)) {
        return res.status(400).json({
          error: 'Title can only contain letters, numbers, and spaces',
        });
      }
    }

    if (content !== undefined) {
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

      if (
        !/^[A-Za-z0-9\s.,?!'"@#$%^&*()[\]{}\-_=+\\|;:<>/~`]+$/.test(content)
      ) {
        return res.status(400).json({
          error:
            'Content can only contain letters, numbers, and common punctuation',
        });
      }
    }

    const updatedDiscussion = await discussionsService.updateDiscussion(
      discussionId,
      userId,
      { title, content }
    );

    return res.status(200).json({ updatedDiscussion });
  }
);

// likes functionality
discussionsRouter.post(
  '/:discussionId/like',
  middleware.checkPermission('LIKE_DISCUSSION'),
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
  middleware.checkPermission('REMOVE_LIKE_FROM_DISCUSSION'),
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

discussionsRouter.get('/:discussionId/likes/count', async (req, res, _next) => {
  const discussionId = Number(req.params.discussionId);

  if (isNaN(discussionId)) {
    return res.status(400).json({ error: 'Invalid discussion ID' });
  }

  const totalLikes = await discussionsService.getTotalLikesForDiscussion(
    discussionId
  );

  return res.status(200).json({ totalLikes });
});

discussionsRouter.get('/:discussionId/likes/users', async (req, res, _next) => {
  const discussionId = Number(req.params.discussionId);

  if (isNaN(discussionId)) {
    return res.status(400).json({ error: 'Invalid discussion ID' });
  }

  const users = await discussionsService.getUsersWhoLikedDiscussion(
    discussionId
  );

  return res.status(200).json({ users });
});

discussionsRouter.get('/:discussionId/likes/check', async (req, res, _next) => {
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
});

// bookmark / save service

discussionsRouter.post(
  '/:discussionId/bookmark',
  middleware.checkPermission('ADD_BOOKMARK_TO_DISCUSSION'),
  async (req, res) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const bookmark = await discussionsService.addBookmark(userId, discussionId);
    return res.status(201).json(bookmark);
  }
);

discussionsRouter.delete(
  '/:discussionId/bookmark',
  middleware.checkPermission('REMOVE_BOOKMARK_FROM_DISCUSSION'),
  async (req, res) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const result = await discussionsService.removeBookmark(
      userId,
      discussionId
    );
    return res.status(200).json(result);
  }
);

// comment functionality

discussionsRouter.post(
  '/:discussionId/comment',
  middleware.checkPermission('COMMENT_DISCUSSION'),
  async (
    req: Request<{ discussionId: string }, unknown, NewComment>,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    const { content } = req.body;

    if (isNaN(discussionId) || discussionId <= 0) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }
    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    if (typeof content !== 'string') {
      return res
        .status(400)
        .json({ error: 'Comment content must be a string' });
    }
    if (content.length < 3) {
      return res
        .status(400)
        .json({ error: 'Comment content must be at least 3 characters' });
    }

    if (content.length > 1000) {
      return res
        .status(400)
        .json({ error: 'Comment content cannot exceed 1000 characters' });
    }

    if (
      !/^[\p{L}\p{N}\p{Emoji}\s.,!?'"@#$%^&*()[\]{}\-_=+\\|;:<>/~`]+$/u.test(
        content
      )
    ) {
      return res.status(400).json({
        error:
          'Content can only contain letters, numbers, spaces, emojis, and common punctuation',
      });
    }

    const comment = await discussionsService.addComment(
      userId,
      discussionId,
      content
    );

    return res.status(201).json(comment);
  }
);

discussionsRouter.get(
  '/:discussionId/comments',
  async (
    req: Request<
      { discussionId: string },
      unknown,
      unknown,
      CommentQueryParams
    >,
    res: Response,
    _next
  ) => {
    const discussionId = Number(req.params.discussionId);
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : 10;
    const sort = req.query.sort ? req.query.sort : 'recent';

    if (isNaN(discussionId) || discussionId <= 0) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const comments = await discussionsService.getComments(
      discussionId,
      limit,
      cursor,
      sort
    );

    return res.status(200).json(comments);
  }
);

// report functionality

discussionsRouter.post(
  '/:discussionId/report',
  middleware.checkPermission('REPORT_DISCUSSION'),
  async (
    req: Request<{ discussionId: string }, unknown, ReportData>,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.decodedToken.id;
    const discussionId = Number(req.params.discussionId);
    const { reportReason, reportNote = '' } = req.body;

    if (isNaN(discussionId)) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    if (!reportReason) {
      return res.status(400).json({ message: 'Report reason is required.' });
    }

    if (reportNote && reportNote.length > 500) {
      return res
        .status(400)
        .json({ error: 'Notes cannot exceed 500 characters' });
    }

    const newReport = await discussionsService.addDiscussionReport(
      discussionId,
      userId,
      reportReason,
      reportNote
    );

    return res.status(201).json(newReport);
  }
);

export default discussionsRouter;
