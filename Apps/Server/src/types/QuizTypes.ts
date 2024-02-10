export type QuizVote = {
  questionId: number,
  vote: number,
}

export type QuizScoreboard = Record<string, number>;