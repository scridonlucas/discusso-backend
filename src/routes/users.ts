import 'express-async-errors';
import { Router, Request, Response } from 'express';
import userValidator from '../utils/validators/userValidator';
import { NewUser } from '../types/userTypes';
import usersService from '../services/usersService';
import middleware from '../utils/middleware';

const usersRouter = Router();

usersRouter.get(
  '/',
  middleware.jwtVerify,
  middleware.checkPermission('GET_USERS'),
  async (_req, res) => {
    const users = await usersService.getUsers();
    res.status(200).json(users);
  }
);

usersRouter.get(
  '/count',
  middleware.jwtVerify,
  middleware.checkPermission('GET_USERS'),
  async (
    req: Request<
      unknown,
      unknown,
      unknown,
      { status?: 'ACTIVE' | 'BANNED'; startDate?: string; endDate?: string }
    >,
    res: Response
  ) => {
    const { status, startDate, endDate } = req.query;

    const decodedStartDate = decodeURIComponent(startDate || '');
    const decodedEndDate = decodeURIComponent(endDate || '');

    const userCount = await usersService.getUserCount(
      status,
      decodedStartDate,
      decodedEndDate
    );

    res.status(200).json(userCount);
  }
);

usersRouter.get(
  '/me',
  middleware.jwtVerify,
  middleware.checkPermission('GET_OWN_USER_DETAILS'),
  async (req, res) => {
    const userId = req.decodedToken.id;
    const user = await usersService.getUser(userId, true);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: 'User not found!' });
    }
  }
);

usersRouter.get(
  '/:userId/public',
  middleware.jwtVerify,
  middleware.checkPermission('GET_PUBLIC_USER_DETAILS'),
  async (req, res) => {
    const id = Number(req.params.userId);
    const user = await usersService.getUser(id, false);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: 'User not found!' });
    }
  }
);

usersRouter.get(
  '/:userId',
  middleware.jwtVerify,
  middleware.checkPermissionWithOwnership(
    'user',
    'userId',
    'GET_OWN_USER_DETAILS',
    'GET_ANY_USER_DETAILS'
  ),
  async (req, res) => {
    const id = Number(req.params.userId);
    const user = await usersService.getUser(id, true);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: 'User not found!' });
    }
  }
);

usersRouter.post('/', async (req, res) => {
  const newUserEntry: NewUser = userValidator.toNewUserEntry(req.body);
  const addedUser = await usersService.addUser(newUserEntry);
  res.json(addedUser);
});

usersRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const deletedUser = await usersService.deleteUser(id);
  if (deletedUser) {
    res.status(204).end();
  } else {
    res.status(404).send({ error: 'User not found!' });
  }
});

usersRouter.get('/check-username/:username', async (req, res) => {
  const username = req.params.username;
  const user = await usersService.getUserByUsername(username);
  if (user) {
    return res.json({ exists: true });
  } else {
    return res.json({ exists: false });
  }
});

usersRouter.get('/check-email/:email', async (req, res) => {
  const email = req.params.email;
  const user = await usersService.getUserByEmail(email);
  if (user) {
    return res.json({ exists: true });
  } else {
    return res.json({ exists: false });
  }
});

usersRouter.patch(
  '/:userId/status',
  middleware.jwtVerify,
  middleware.checkPermission('UPDATE_USER_STATUS'),
  async (
    req: Request<{ userId: string }, unknown, { status?: 'ACTIVE' | 'BANNED' }>,
    res: Response
  ) => {
    const userId = Number(req.params.userId);
    const status = req.body.status;

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedUser = await usersService.updateUserStatus(userId, status);

    return res.status(200).json(updatedUser);
  }
);

usersRouter.patch(
  '/:userId/role',
  middleware.jwtVerify,
  middleware.checkPermission('UPDATE_USER_ROLE'),
  async (
    req: Request<{ userId: string }, unknown, { roleName?: 'USER' | 'ADMIN' }>,
    res: Response
  ) => {
    const userId = Number(req.params.userId);
    const roleName = req.body.roleName;

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!roleName || !['USER', 'ADMIN'].includes(roleName)) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const updatedUser = await usersService.updateUserRole(userId, roleName);

    return res.status(200).json(updatedUser);
  }
);

usersRouter.post(
  '/:userId/follow',
  middleware.jwtVerify,
  middleware.checkPermission('FOLLOW_USER'),
  async (req: Request<{ userId: string }>, res: Response) => {
    const followerId = req.decodedToken.id;
    const followeeId = Number(req.params.userId);

    if (isNaN(followeeId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const follow = await usersService.followUser(followerId, followeeId);

    return res.status(201).json(follow);
  }
);

usersRouter.delete(
  '/:userId/follow',
  middleware.jwtVerify,
  middleware.checkPermission('FOLLOW_USER'),
  async (req: Request<{ userId: string }>, res: Response) => {
    const followerId = req.decodedToken.id;
    const followeeId = Number(req.params.userId);

    if (isNaN(followeeId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const unfollow = await usersService.unfollowUser(followerId, followeeId);

    return res.status(200).json(unfollow);
  }
);

export default usersRouter;
