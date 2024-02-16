export type VoteData = {
  vote: number,
};

export type QuestionData = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
}

export type QuizData = {
  questions: QuestionData[],
  questionIndex: number,
}

export type ScoreboardData = Record<string, number>;