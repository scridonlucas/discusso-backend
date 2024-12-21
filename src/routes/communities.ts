import 'express-async-errors';
import communitiesService from '../services/communitiesService';
import middleware from '../utils/middleware';
import { Router, Request, Response } from 'express';
import { NewCommunity, CommunityUpdateInput } from '../types/communityTypes';
const communitiesRouter = Router();

communitiesRouter.get(
  '/',
  middleware.jwtVerify,
  async (_req: Request, res: Response, _next) => {
    const communities = await communitiesService.getCommunities();

    return res.status(200).json(communities);
  }
);

communitiesRouter.patch(
  '/:communityId/update',
  middleware.jwtVerify,
  middleware.checkPermission('UPDATE_COMMUNITY'),
  async (
    req: Request<{ communityId: string }, unknown, CommunityUpdateInput>,
    res: Response
  ) => {
    const communityId = Number(req.params.communityId);
    const communityData = req.body;

    if (isNaN(communityId)) {
      return res.status(400).json({ error: 'Invalid community ID' });
    }

    const updatedCommunity = await communitiesService.updateCommunity(
      communityId,
      communityData
    );

    return res.status(200).json(updatedCommunity);
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

    if (description && description.length > 300 && description.length < 3) {
      return res
        .status(400)
        .json({ error: 'Description is too long or short' });
    }

    const nameRegex = /^[a-zA-Z]+$/;

    if (!nameRegex.test(communityName)) {
      return res.status(400).json({
        error: 'Community name can only contain alphabetic characters.',
      });
    }

    const descRegex = /^[a-zA-Z0-9\s.,'";:!?\-()&]+$/;

    if (description && !descRegex.test(description)) {
      return res.status(400).json({
        error: 'Description contains invalid characters.',
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
