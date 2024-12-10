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

    res.status(200).json(discussionReports);
  }
);

export default discussionReportsRouter;
