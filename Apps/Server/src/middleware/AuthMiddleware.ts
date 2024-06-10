import { RequestHandler } from 'express';
import { COOKIE_NAME } from '../config';
import { decodeCookie } from '../utils/cookies';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse } from '../utils/calls';

const AuthMiddleware: RequestHandler = async (req, res, next) => {
  const cookies = req.cookies;

  // Try to decode JWT cookie to rebuild user object
  const cookie = cookies[COOKIE_NAME] ? decodeCookie(cookies[COOKIE_NAME]) : null;

  // Oops! That cookie is not good!
  if (!cookie) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send(errorResponse('UNAUTHORIZED'));
  }

  // Store user and quiz information in request
  req.user = cookie.user;
  req.quiz = cookie.quiz;

  next();
}

export default AuthMiddleware;