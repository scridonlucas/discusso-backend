import { Request } from 'express';

export interface Cookie {
  token: string;
}

export interface CustomRequest extends Request {
  decodedToken?: UserToken;
}

export interface UserToken {
  username: string;
  id: number;
}
