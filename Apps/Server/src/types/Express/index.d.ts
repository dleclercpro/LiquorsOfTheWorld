import { SessionUser } from '../UserTypes';
import { QuizName } from '../../constants';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser,
      quizId?: string,
      quizName?: QuizName,
    }
  }
}