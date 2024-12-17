import 'express-async-errors';
import { Router, Request, Response, NextFunction } from 'express';
import middleware from '../utils/middleware';
import moderationLogsService from '../services/moderationLogsService';
import { NewModerationLog } from '../types/moderationLogsTypes';
const moderationLogsRouter = Router();

moderationLogsRouter.get(
  '/',
  middleware.jwtVerify,
  middleware.checkPermission('GET_LOGS'),
  async (_req: Request, res: Response, _next: NextFunction) => {
    const moderationLogs = await moderationLogsService.getModerationLogs();
    res.status(200).json(moderationLogs);
  }
);

moderationLogsRouter.post(
  '/',
  middleware.jwtVerify,
  middleware.checkPermission('CREATE_LOG'),
  async (
    req: Request<unknown, unknown, NewModerationLog, unknown>,
    res: Response,
    _next: NextFunction
  ) => {
    const adminId = req.decodedToken.id;

    const { userId, action, targetId } = req.body;

    if (!action || !adminId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const moderationLog = await moderationLogsService.addModerationLog(
      adminId,
      userId || null,
      action,
      targetId || null
    );

    return res.status(201).json(moderationLog);
  }
);

export default moderationLogsRouter;
