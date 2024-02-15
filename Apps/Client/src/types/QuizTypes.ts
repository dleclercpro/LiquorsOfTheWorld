export type VoteData = number;

export type QuestionData = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
}

export type QuizData = {
  questions: QuestionData[],
  index: number,
}

export type ScoreboardData = Record<string, number>;