import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import toNewUserEntry from '../utils/validators/userValidator/userValidator';
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
  res.json(user);
}) as RequestHandler);

usersRouter.post('/', (async (req, res) => {
  const newUserEntry: NewUser = toNewUserEntry(req.body);
  const addedUser = await usersService.addUser(newUserEntry);
  res.json(addedUser);
}) as RequestHandler);

usersRouter.delete('/:id', (async (req, _res) => {
  const id = Number(req.params.id);
  await usersService.deleteUser(id);
}) as RequestHandler);

export default usersRouter;
