import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';
import { DatabaseUser } from '../types/UserTypes';

export const encodeCookie = async (user: DatabaseUser) => {
  const cookie = await jwt.sign(user, TOKEN_SECRET);

  return cookie;
}

export const decodeCookie = (cookie: string) => {
  const { iat, ...user } = jwt.verify(cookie, TOKEN_SECRET) as DatabaseUser & { iat: number };

  return user;
}