import 'express-async-errors';
import middleware from '../utils/middleware';
import { Router, Request, Response } from 'express';
import discussionReportsService from '../services/discussionReportsService';
import { ReportsQueryParams } from '../types/requestTypes';

const discussionReportsRouter = Router();

discussionReportsRouter.get(
  '/',
  middleware.jwtVerify,
  middleware.checkPermission('GET_DISCUSSION_REPORTS'),

  async (
    req: Request<unknown, unknown, unknown, ReportsQueryParams>,
    res: Response
  ) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const status = req.query.status ? req.query.status : 'PENDING';

    const discussionReports =
      await discussionReportsService.getDiscussionReports(
        limit,
        cursor,
        status
      );

    return res.status(200).json(discussionReports);
  }
);

discussionReportsRouter.get(
  '/:discussionId',
  middleware.jwtVerify,
  middleware.checkPermission('GET_DISCUSSION_REPORTS'),
  async (req, res, _next) => {
    const discussionId = Number(req.params.discussionId);

    if (isNaN(discussionId) || discussionId <= 0) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const discussionReport =
      await discussionReportsService.getDiscussionReportById(discussionId);

    return res.status(200).json(discussionReport);
  }
);

export default discussionReportsRouter;
