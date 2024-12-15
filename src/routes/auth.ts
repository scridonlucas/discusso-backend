import 'express-async-errors';
import { Router } from 'express';
import middleware from '../utils/middleware';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import loginValidator from '../utils/validators/loginValidator';
import { UserAttributes, LoginUser } from '../types/userTypes';
import usersService from '../services/usersService';
import loginService from '../services/loginService';
import config from '../utils/config';
import { Request } from 'express';
import { getUserWithRole } from '../services/usersService';

const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password }: LoginUser = loginValidator.toNewLoginEntry(
    req.body
  );

  const user: UserAttributes | null = await usersService.getUserByEmail(email);
  const passwordCorrect = await loginService.comparePasswords(user, password);

  if (user && user.status === 'BANNED') {
    return res.status(403).json({ error: 'User is banned!' });
  }

  if (passwordCorrect && user && user.status === 'ACTIVE') {
    const userForToken = {
      username: user.username,
      id: user.id,
    };
    const token = jwt.sign(userForToken, config.JWT, {
      expiresIn: 60 * 60,
    });

    res.cookie('token', token, { httpOnly: true });

    return res.status(200).send({
      success: true,
    });
  }
  return res.status(401).json({ error: 'Invalid username or password!' });
});

authRouter.get('/logout', (_req, res: Response, _next) => {
  res.clearCookie('token');
  res.status(200).json({ success: true });
});

authRouter.get(
  '/verify',
  middleware.jwtVerify,
  middleware.checkUserStatus,
  async (req: Request, res: Response, _next) => {
    const username = req.decodedToken.username;
    const userId = req.decodedToken.id;
    const user = await getUserWithRole(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        username: username,
        userId: userId,
        role: user.role.roleName,
      },
    });
  }
);

export default authRouter;
