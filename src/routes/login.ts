import 'express-async-errors';
import { Router } from 'express';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import loginValidator from '../utils/validators/loginValidator';
import { LoginUser } from '../types/types';
const loginRouter = Router();

loginRouter.post('/', (async (req, res) => {
  const newLoginEntry: LoginUser = loginValidator.toNewLoginEntry(req.body);
  console.log(newLoginEntry);
}) as RequestHandler);

export default loginRouter;
