import { Router } from 'express';
import toNewUserEntry from '../utils/validators/userValidator/userValidator';
import { NewUser } from '../types/types';
import usersService from '../services/usersService';
const usersRouter = Router();

usersRouter.get('/', (_req, res) => {
  res.send(usersService.getUsers());
});

usersRouter.post('/', (req, res) => {
  try {
    const newUserEntry: NewUser = toNewUserEntry(req.body);
    const addedUser = usersService.addUser(newUserEntry);
    res.json(addedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
});
export default usersRouter;
