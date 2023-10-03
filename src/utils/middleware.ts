import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { BaseError, ValidationError } from 'sequelize';

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
  if (error instanceof ValidationError) {
    return res.status(400).send({ error: 'Validation error!' });
  }
  if (error instanceof BaseError) {
    return res.status(504).json({ error: error.message });
  }

  return next(error);
};

export default { unknownEndPoint, errorHandler };
