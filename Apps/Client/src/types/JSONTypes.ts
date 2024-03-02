import { QuestionType } from '../constants';

export type QuestionJSON = {
  type: QuestionType,
  theme: string,
  question: string,
  options: string[],
  answer: number,
  url?: string,
};

export type QuizJSON = QuestionJSON[];