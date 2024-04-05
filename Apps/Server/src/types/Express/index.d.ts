import { User } from '../UserTypes';
import { QuizName } from '../../constants';

declare global {
  namespace Express {
    interface Request {
      user?: User,
      quizId?: string,
      quizName?: QuizName,
    }
  }
}