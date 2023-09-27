import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import toNewUserEntry from '../utils/validators/userValidator/userValidator';
import { NewUser } from '../types/types';
import usersService from '../services/usersService';
import models from '../models/index';

const { User } = models;
const usersRouter = Router();

usersRouter.get('/', (async (_req, res) => {
  const users = await User.findAll();
  res.json(users);
}) as RequestHandler);

usersRouter.post('/', (req, res) => {
  const newUserEntry: NewUser = toNewUserEntry(req.body);
  const addedUser = usersService.addUser(newUserEntry);
  res.json(addedUser);
});
export default usersRouter;
