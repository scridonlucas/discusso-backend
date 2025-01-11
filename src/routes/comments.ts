import 'express-async-errors';
import middleware from '../utils/middleware';
import commentsService from '../services/commentsService';
import { Router, Request, Response, NextFunction } from 'express';
import { ReportData } from '../types/discussionType';

const commentsRouter = Router();

commentsRouter.post(
  '/comments/:commentId/like',
  middleware.jwtVerify,
  middleware.checkPermission('LIKE_COMMENT'),
  async (req, res, _next) => {
    const userId = req.decodedToken.id;
    const commentId = Number(req.params.commentId);

    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    const like = await commentsService.addCommentLike(userId, commentId);

    return res.status(201).json(like);
  }
);

commentsRouter.delete(
  '/comments/:commentId/like',
  middleware.jwtVerify,
  middleware.checkPermission('REMOVE_LIKE_FROM_COMMENT'),
  async (req, res, _next) => {
    const userId = req.decodedToken.id;
    const commentId = Number(req.params.commentId);

    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    const removedLike = await commentsService.removeCommentLike(
      userId,
      commentId
    );

    return res.status(200).json(removedLike);
  }
);

commentsRouter.post(
  '/comments/:commentId/report',
  middleware.jwtVerify,
  middleware.checkPermission('REPORT_COMMENT'),
  async (
    req: Request<{ commentId: string }, unknown, ReportData>,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.decodedToken.id;
    const commentId = Number(req.params.commentId);
    const { reportReason, reportNote = '' } = req.body;

    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    if (!reportReason) {
      return res.status(400).json({ message: 'Report reason is required.' });
    }

    if (reportNote && reportNote.length > 500) {
      return res
        .status(400)
        .json({ error: 'Notes cannot exceed 500 characters' });
    }

    const newReport = await commentsService.addComentReport(
      commentId,
      userId,
      reportReason,
      reportNote
    );

    return res.status(201).json(newReport);
  }
);

export default commentsRouter;
