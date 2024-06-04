import { Response, NextFunction, Request } from 'express';
import logger from '../logger';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse } from '../utils/calls';
import { COOKIE_NAME, COOKIE_OPTIONS } from '../config';

// Custom middleware function to log requests
const ErrorMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    logger.fatal(`An unexpected error occurred: ${err.message}`);
  }

  // Unknown error
  return res
    .clearCookie(COOKIE_NAME, COOKIE_OPTIONS) // Log user out, just in case
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json(errorResponse('INTERNAL_SERVER_ERROR'));
}

export default ErrorMiddleware;