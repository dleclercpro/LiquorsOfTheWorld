import { SessionQuiz, SessionUser } from '../UserTypes';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser,
      quiz?: SessionQuiz,
    }
  }
}