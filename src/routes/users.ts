import { Router } from 'express';
import toNewUserEntry from '../utils/validators/userValidator/userValidator';
import { NewUser } from '../../types';
import { addUser, getUsers } from '../services/users';
const usersRouter = Router();

usersRouter.get('/', (_req, res) => {
  res.send(getUsers());
});

usersRouter.post('/', (req, res) => {
  try {
    const newUserEntry: NewUser = toNewUserEntry(req.body);
    const addedUser = addUser(newUserEntry);
    res.json(addedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
});
export default usersRouter;
