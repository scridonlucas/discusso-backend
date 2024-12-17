import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import middleware from './utils/middleware';
import discussionsRouter from './routes/discussions';
import commentsRouter from './routes/comments';
import communitiesRouter from './routes/communities';
import discussionReportsRouter from './routes/discussionReports';
import commentReportsRouter from './routes/commentReports';
import moderationLogsRouter from './routes/moderationLogs';
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
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
app.use('/api/comments', commentsRouter);
app.use('/api/discussion-reports', discussionReportsRouter);
app.use('/api/comment-reports', commentReportsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/moderation-logs', moderationLogsRouter);
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

export default app;
