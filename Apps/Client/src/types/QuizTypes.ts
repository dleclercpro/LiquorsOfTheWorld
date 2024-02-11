export type Vote = {
  questionIndex: number,
  vote: number,
}

export type Question = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
}

export type Quiz = Question[];

export type Scores = Record<string, number>;