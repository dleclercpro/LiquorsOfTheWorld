import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';
import { User } from '../types/UserTypes';

export const encodeCookie = async (user: User) => {
  const cookie = await jwt.sign(user, TOKEN_SECRET);

  return cookie;
}

export const decodeCookie = (cookie: string) => {
  const user = jwt.verify(cookie, TOKEN_SECRET) as User;

  return user;
}