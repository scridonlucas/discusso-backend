import 'express-async-errors';
import middleware from '../utils/middleware';
import { Router, Request, Response } from 'express';
import { ReportsQueryParams } from '../types/requestTypes';
import commentReportsService from '../services/commentReportsService';
import { NewCloseReport } from '../types/reportTypes';
const commentReportsRouter = Router();

commentReportsRouter.get(
  '/',
  middleware.jwtVerify,
  middleware.checkPermission('GET_COMMENT_REPORTS'),

  async (
    req: Request<unknown, unknown, unknown, ReportsQueryParams>,
    res: Response
  ) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const status = req.query.status ? req.query.status : 'PENDING';

    const commentReports = await commentReportsService.getReportedComments(
      limit,
      cursor,
      status
    );

    return res.status(200).json(commentReports);
  }
);

commentReportsRouter.get(
  '/:commentId',
  middleware.jwtVerify,
  middleware.checkPermission('GET_COMMENT_REPORTS'),
  async (req, res) => {
    const commentId = Number(req.params.commentId);

    if (isNaN(commentId)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    const commentReport = await commentReportsService.getCommentReportById(
      commentId
    );

    return res.status(200).json(commentReport);
  }
);

commentReportsRouter.patch(
  '/:discussionId',
  middleware.jwtVerify,
  middleware.checkPermission('CHANGE_COMMENT_REPORT_STATUS'),
  async (
    req: Request<
      { commentId: string },
      unknown,
      { status?: 'PENDING' | 'RESOLVED' | 'DISMISSED' }
    >,
    res: Response
  ) => {
    const commentId = Number(req.params.commentId);
    const status = req.body.status;

    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const commentReport = await commentReportsService.updateCommentReportStatus(
      commentId,
      status
    );

    return res.status(200).json({ commentReport });
  }
);

commentReportsRouter.post(
  '/:reportId/close',
  middleware.jwtVerify,
  middleware.checkPermission('CLOSE_TICKET'),
  async (
    req: Request<{ reportId: string }, unknown, NewCloseReport>,
    res: Response
  ) => {
    const adminId = req.decodedToken.id;
    const reportId = Number(req.params.reportId);

    const { action } = req.body;

    if (isNaN(adminId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!reportId || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const commentReport = await commentReportsService.closeCommentReport(
      adminId,
      reportId,
      action
    );

    return res.status(200).json(commentReport);
  }
);

export default commentReportsRouter;
