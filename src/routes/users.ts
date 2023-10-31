import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import userValidator from '../utils/validators/userValidator';
import { NewUser } from '../types/types';
import usersService from '../services/usersService';

const usersRouter = Router();

usersRouter.get('/', (async (_req, res) => {
  const users = await usersService.getUsers();
  res.json(users);
}) as RequestHandler);

usersRouter.get('/:id', (async (req, res) => {
  const id = Number(req.params.id);
  const user = await usersService.getUser(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send({ error: 'User not found!' });
  }
}) as RequestHandler);

usersRouter.post('/', (async (req, res) => {
  const newUserEntry: NewUser = userValidator.toNewUserEntry(req.body);
  const addedUser = await usersService.addUser(newUserEntry);
  res.json(addedUser);
}) as RequestHandler);

usersRouter.delete('/:id', (async (req, res) => {
  const id = Number(req.params.id);
  const deletedUser = await usersService.deleteUser(id);
  if (deletedUser) {
    res.status(204).end();
  } else {
    res.status(404).send({ error: 'User not found!' });
  }
}) as RequestHandler);

usersRouter.get('/check-username/:username', (async (req, res) => {
  const username = req.params.username;
  const user = await usersService.getUserByUsername(username);
  if (user) {
    return res.json({ exists: true });
  } else {
    return res.json({ exists: false });
  }
}) as RequestHandler);

usersRouter.get('/check-email/:email', (async (req, res) => {
  const email = req.params.email;
  const user = await usersService.getUserByEmail(email);
  if (user) {
    return res.json({ exists: true });
  } else {
    return res.json({ exists: false });
  }
}) as RequestHandler);

export default usersRouter;
