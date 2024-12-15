import 'express-async-errors';
import { Router, Request, Response } from 'express';
import userValidator from '../utils/validators/userValidator';
import { NewUser } from '../types/userTypes';
import usersService from '../services/usersService';
import middleware from '../utils/middleware';

const usersRouter = Router();

usersRouter.get('/', async (_req, res) => {
  const users = await usersService.getUsers();
  res.json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = await usersService.getUser(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send({ error: 'User not found!' });
  }
});

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
  '/:userId',
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

export default usersRouter;
