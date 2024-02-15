export type VoteData = {
  questionIndex: number,
  vote: number,
}

export type QuestionData = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
}

export type QuizData = QuestionData[];

export type ScoreboardData = Record<string, number>;