import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';
import { User } from '../types/UserTypes';

type Cookie = {
  user: User,
  quizId: string,
}

type JWTCookie = Cookie & {
  iat: number,
}

export const encodeCookie = async (cookie: Cookie) => {
  return jwt.sign(cookie, TOKEN_SECRET);
}

export const decodeCookie = (cookieString: string) => {
  const { iat, ...cookie } = jwt.verify(cookieString, TOKEN_SECRET) as JWTCookie;

  return cookie;
}