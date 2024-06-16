import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BaseError, ValidationError } from 'sequelize';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from './config';
import 'express-async-errors';
import cookiesValidator from './validators/cookiesValidator';
import { CustomTokenError } from './customErrors';
import { UserToken } from '../types/authTypes';

const jwtVerify = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const cookies = cookiesValidator.toNewCookie(req.cookies);
    const token = cookies.token;
    const decodedToken = jwt.verify(token, config.JWT) as UserToken;
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

const unknownEndPoint = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).send({
    error: 'unknown endpoint',
  });
};

const errorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.message);
  console.log(error.name);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: `There is a unique constraint violation.`,
      });
    }
    return res.status(400).json({ error: `Prisma error: ${error.message}` });
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return res
      .status(500)
      .json({ error: 'An unknown error occurred with Prisma.' });
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return res
      .status(500)
      .json({ error: 'A panic occurred in the Prisma engine.' });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return res
      .status(500)
      .json({ error: 'Failed to initialize Prisma Client.' });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res
      .status(400)
      .json({ error: 'Validation error with Prisma Client.' });
  }

  if (error instanceof ValidationError) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(400).send({ error: 'Validation error!' });
  }
  if (error instanceof CustomTokenError) {
    return res.status(401).json({ error: error.message });
  }
  if (error instanceof BaseError) {
    return res.status(504).json({ error: error.message });
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  return next(error);
};

export default { unknownEndPoint, errorHandler, jwtVerify };
