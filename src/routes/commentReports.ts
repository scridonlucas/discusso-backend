import 'express-async-errors';
import middleware from '../utils/middleware';
import { Router, Request, Response } from 'express';
import { ReportsQueryParams } from '../types/requestTypes';
import commentReportsService from '../services/commentReportsService';

const commentReportsRouter = Router();

commentReportsRouter.get(
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

    const commentReports = await commentReportsService.getReportedComments(
      limit,
      cursor,
      status
    );

    res.status(200).json(commentReports);
  }
);
export default commentReportsRouter;
