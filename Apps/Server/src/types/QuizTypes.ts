export type QuizBoxJSON = {
  theme: string,
  question: string,
  options: string[],
  answer: number,
}

export type QuizVote = {
  questionIndex: number,
  vote: number,
}

export type QuizScoreboard = Record<string, number>;