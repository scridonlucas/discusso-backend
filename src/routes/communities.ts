import 'express-async-errors';
import communitiesService from '../services/communitiesService';
import middleware from '../utils/middleware';
import { Router, Request, Response } from 'express';

const communitiesRouter = Router();

communitiesRouter.get(
  '/',
  middleware.jwtVerify,
  async (_req: Request, res: Response, _next) => {
    const communities = await communitiesService.getCommunities();

    return res.status(201).json(communities);
  }
);

export default communitiesRouter;
