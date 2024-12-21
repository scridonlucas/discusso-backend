import 'express-async-errors';
import communitiesService from '../services/communitiesService';
import middleware from '../utils/middleware';
import { Router, Request, Response } from 'express';
import { NewCommunity } from '../types/communityTypes';
const communitiesRouter = Router();

communitiesRouter.get(
  '/',
  middleware.jwtVerify,
  async (_req: Request, res: Response, _next) => {
    const communities = await communitiesService.getCommunities();

    return res.status(201).json(communities);
  }
);

communitiesRouter.post(
  '/',
  middleware.jwtVerify,
  middleware.checkPermission('CREATE_COMMUNITY'),
  async (req: Request<unknown, unknown, NewCommunity>, res: Response) => {
    const userId = Number(req.decodedToken.id);
    const { communityName, description } = req.body;

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!communityName) {
      return res.status(400).json({ error: 'Community name is required' });
    }

    if (communityName.length < 3 || communityName.length > 30) {
      return res
        .status(400)
        .json({ error: 'Community name is too short or long' });
    }

    const nameRegex = /^[a-zA-Z]+$/;

    if (!nameRegex.test(communityName)) {
      return res.status(400).json({
        error: 'Community name can only contain alphabetic characters.',
      });
    }

    const community = await communitiesService.addCommunity(
      communityName,
      userId,
      description
    );
    return res.status(201).json(community);
  }
);
export default communitiesRouter;
