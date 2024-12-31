import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
  RequestHandler,
} from 'express';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from './config';
import 'express-async-errors';
import cookiesValidator from './validators/cookiesValidator';
import {
  CustomTokenError,
  CustomPermissionError,
  CustomDiscussionError,
  CustomReportError,
  CustomUserStatusError,
  CustomAPIError,
  CustomStocksError,
} from './customErrors';
import { UserToken } from '../types/authTypes';
import { Resource } from '../types/resourceTypes';
import permissionsService from '../services/permissionsService';
import ownershipService from '../services/ownershipService';
import usersService from '../services/usersService';

const checkPermission = (permission: string): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.decodedToken.id;
      const hasPerm = await permissionsService.hasPermission(
        userId,
        permission
      );

      if (!hasPerm) {
        throw new CustomPermissionError(
          'You do not have permission to perform this action'
        );
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};

const checkPermissionWithOwnership = (
  resourceType: Resource,
  resourceIdParam: string,
  ownPermission: string,
  anyPermission: string
): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.decodedToken.id;
      const resourceId = Number(req.params[resourceIdParam]);

      if (isNaN(resourceId)) {
        throw new CustomPermissionError('Invalid resource ID');
      }

      const hasAnyPermission = await permissionsService.hasPermission(
        userId,
        anyPermission
      );

      if (hasAnyPermission) {
        return next(); // if user has any permission, allow access
      }

      const hasOwnPermission = await permissionsService.hasPermission(
        userId,
        ownPermission
      );

      if (!hasOwnPermission) {
        throw new CustomPermissionError(
          'You do not have permission to perform this action'
        );
      }

      const isUserOwner = await ownershipService.isOwner(
        resourceType,
        userId,
        resourceId
      );

      if (!isUserOwner) {
        throw new CustomPermissionError('You do not own this resource');
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};

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

const checkUserStatus = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.decodedToken.id;
    const user = await usersService.getUser(userId, true);
    if (!user) {
      throw new CustomUserStatusError('User not found.');
    }

    if (user.status === 'BANNED') {
      throw new CustomUserStatusError('User is banned.');
    }

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

  if (error instanceof CustomTokenError) {
    return res.status(401).json({ error: error.message });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
    });
  }

  if (error instanceof CustomPermissionError) {
    return res.status(401).json({ error: error.message });
  }

  if (error instanceof CustomDiscussionError) {
    return res.status(401).json({ error: error.message });
  }

  if (error instanceof CustomUserStatusError) {
    return res.status(403).json({ error: error.message });
  }
  if (error instanceof CustomReportError) {
    return res.status(401).json({ error: error.message });
  }

  if (error instanceof CustomStocksError) {
    res.status(401).json({ error: error.message });
  }

  if (error instanceof CustomAPIError) {
    res.status(502).json({ error: error.message });
  }

  return next(error);
};

export default {
  unknownEndPoint,
  errorHandler,
  jwtVerify,
  checkPermission,
  checkPermissionWithOwnership,
  checkUserStatus,
};
