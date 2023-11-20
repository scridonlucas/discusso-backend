import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BaseError, ValidationError } from 'sequelize';
import 'express-async-errors';
import cookiesValidator from './validators/cookiesValidator';

const jwtExtractor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const cookies = cookiesValidator.toNewCookie(req.cookies);
    const token: string = cookies.token;
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
  if (error instanceof ValidationError) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(400).send({ error: 'Validation error!' });
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

export default { unknownEndPoint, errorHandler };
