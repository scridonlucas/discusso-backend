import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import loginValidator from '../utils/validators/loginValidator';
import { LoginUser } from '../types/types';
import usersService from '../services/usersService';

const loginRouter = Router();

loginRouter.post('/', (async (req, res) => {
  const { email, password }: LoginUser = loginValidator.toNewLoginEntry(
    req.body
  );

  const user = await usersService.getUserByEmail(email);
}) as RequestHandler);

export default loginRouter;
