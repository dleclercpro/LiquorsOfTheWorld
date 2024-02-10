export type Vote = {
  questionId: number,
  vote: number,
}

export type QuestionData = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
}

export type QuizData = QuestionData[];

export type Scores = Record<string, number>;