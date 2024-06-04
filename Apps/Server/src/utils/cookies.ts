import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';
import { SessionUser } from '../types/UserTypes';
import { QuizData } from '../types/DataTypes';

type Cookie = QuizData & {
  user: SessionUser,
  team: string,
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