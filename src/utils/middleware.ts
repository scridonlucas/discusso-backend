import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

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
  console.log(error.name);
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  return next(error);
};

export default { unknownEndPoint, errorHandler };
