import 'express-async-errors';
import middleware from '../utils/middleware';
import { Router, Request, Response, NextFunction } from 'express';
import discussionReportsService from '../services/discussionReportsService';
import { ReportsQueryParams } from '../types/requestTypes';
import { NewCloseReport } from '../types/reportTypes';
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
  '/:reportId',
  middleware.jwtVerify,
  middleware.checkPermission('GET_DISCUSSION_REPORTS'),
  async (req, res, _next) => {
    const reportId = Number(req.params.reportId);

    if (isNaN(reportId) || reportId <= 0) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    const discussionReport =
      await discussionReportsService.getDiscussionReportById(reportId);

    return res.status(200).json(discussionReport);
  }
);

discussionReportsRouter.patch(
  '/:reportId',
  middleware.jwtVerify,
  middleware.checkPermission('CHANGE_DISCUSSION_REPORT_STATUS'),
  async (
    req: Request<
      { reportId: string },
      unknown,
      { status?: 'PENDING' | 'RESOLVED' | 'DISMISSED' }
    >,
    res: Response
  ) => {
    const reportId = Number(req.params.reportId);
    const status = req.body.status;

    if (isNaN(reportId) || reportId <= 0) {
      return res.status(400).json({ error: 'Invalid discussion ID' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const discussionReport =
      await discussionReportsService.updateDiscussionReportStatus(
        reportId,
        status
      );

    return res.status(200).json(discussionReport);
  }
);

discussionReportsRouter.post(
  '/:reportId/close',
  middleware.jwtVerify,
  middleware.checkPermission('CLOSE_TICKET'),
  async (
    req: Request<{ reportId: string }, unknown, NewCloseReport>,
    res: Response,
    _next: NextFunction
  ) => {
    const adminId = req.decodedToken.id;
    const reportId = Number(req.params.reportId);

    const { targetResourceId, reportedUserId, action, reason } = req.body;

    if (isNaN(adminId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    console.log(adminId, reportId, targetResourceId, reportedUserId, action);
    if (
      !reportId ||
      !targetResourceId ||
      !reportedUserId ||
      !action ||
      !reason
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const discussionReport =
      await discussionReportsService.closeDiscussionReport(
        adminId,
        reportId,
        targetResourceId,
        reportedUserId,
        action,
        reason
      );

    return res.status(200).json(discussionReport);
  }
);
export default discussionReportsRouter;
