import { User } from '../UserTypes';

declare global {
  namespace Express {
    interface Request {
      user?: User,
      quizId?: string,
    }
  }
}