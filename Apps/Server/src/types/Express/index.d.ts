import { DatabaseUser } from '../UserTypes';

declare global {
  namespace Express {
    interface Request {
      user?: DatabaseUser,
    }
  }
}