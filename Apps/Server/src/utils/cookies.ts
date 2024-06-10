import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';
import { SessionQuiz, SessionUser } from '../types/UserTypes';

type Cookie = {
  user: SessionUser,
  quiz: SessionQuiz,
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