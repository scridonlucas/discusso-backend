import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import loginValidator from '../utils/validators/loginValidator';
import { BaseUser, LoginUser } from '../types/types';
import usersService from '../services/usersService';
import loginService from '../services/loginService';

const loginRouter = Router();

loginRouter.post('/', (async (req, res) => {
  const { email, password }: LoginUser = loginValidator.toNewLoginEntry(
    req.body
  );

  const user: BaseUser | null = await usersService.getUserByEmail(email);
  const passwordCorrect = await loginService.comparePasswords(user, password);

  if (passwordCorrect && user) {
    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, 'tokenpassword', {
      expiresIn: 60 * 60,
    });

    res.status(200).send({ token, username: user.username, email: user.email });
  }
  return res.status(401).json({ error: 'Invalid username or password!' });
}) as RequestHandler);

export default loginRouter;
