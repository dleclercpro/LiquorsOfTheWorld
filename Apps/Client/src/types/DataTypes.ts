import { Auth } from '.';

export type PingData = {
  quizId: string,
}

export type LoginData = Auth & {
  quizId: string,
}

export type VoteData = {
  vote: number,
};

export type QuestionData = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
};

export type QuizData = {
  questions: QuestionData[],
};

export type QuestionIndexData = {
  questionIndex: number,
}

export type ScoreboardData = Record<string, number>;