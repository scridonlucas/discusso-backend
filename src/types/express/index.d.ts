import { UserToken } from '../authTypes';

declare module 'express-serve-static-core' {
  interface Request {
    decodedToken: UserToken;
    userPermissions: string[];
  }
}
