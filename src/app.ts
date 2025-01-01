import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import middleware from './utils/middleware';
import helmet from 'helmet';

import {
  usersRouter,
  discussionsRouter,
  commentsRouter,
  communitiesRouter,
  discussionReportsRouter,
  commentReportsRouter,
  notificationsRouter,
  moderationLogsRouter,
  authRouter,
  stocksRouter,
} from './routes';
import { initializeTrendingScheduler } from './jobs/scheduleTrendingJob';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.static('dist'));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use(
  '/api/discussions',
  middleware.jwtVerify,
  middleware.checkUserStatus,
  discussionsRouter
);
app.use('/api/notifications', notificationsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/discussion-reports', discussionReportsRouter);
app.use('/api/comment-reports', commentReportsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/moderation-logs', moderationLogsRouter);
app.use('/api/stocks', middleware.jwtVerify, stocksRouter);

app.get('*', middleware.serveReactApp);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

initializeTrendingScheduler(); // background script that updates trending scores hourly

export default app;
