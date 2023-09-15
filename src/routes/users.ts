import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/', (_req, res) => {
  res.send('pong');
});

export default usersRouter;
