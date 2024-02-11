import { RequestHandler } from 'express';
import logger from '../logger';

// Custom middleware function to log requests
const RequestMiddleware: RequestHandler = async (req, res, next) => {
  logger.trace(`${req.method} ${req.url}`);
  
  next();
}

export default RequestMiddleware;