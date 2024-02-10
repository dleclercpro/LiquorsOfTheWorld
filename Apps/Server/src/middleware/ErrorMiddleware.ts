import { Response, NextFunction, Request } from 'express';
import logger from '../logger';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';

// Custom middleware function to log requests
const ErrorMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    logger.fatal(`An unexpected error occurred: ${err.message}`);
  }

  // Unknown error
  return res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
}

export default ErrorMiddleware;