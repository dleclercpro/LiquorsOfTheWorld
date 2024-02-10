export type QuizVote = {
  questionId: number,
  vote: number,
}

export type QuizQuestionResponse = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
}

export type QuizResponse = QuizQuestionResponse[];

export type QuizScoreboard = Record<string, number>;