import { RequestHandler } from 'express';
import logger from '../logger';
import { COOKIE_NAME } from '../config';
import { decodeCookie } from '../utils/cookies';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { errorResponse } from '../utils/calls';

const AuthMiddleware: RequestHandler = async (req, res, next) => {
  const cookies = req.cookies;

  // Try to decode JWT cookie to rebuild user object
  const cookie = cookies[COOKIE_NAME];
  const user = cookie ? decodeCookie(cookie) : null;
  
  // Oops! That cookie is not good!
  if (!user) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send(errorResponse(HttpStatusMessage.UNAUTHORIZED));
  }

  // Store user in request
  req.user = user;

  next();
}

export default AuthMiddleware;