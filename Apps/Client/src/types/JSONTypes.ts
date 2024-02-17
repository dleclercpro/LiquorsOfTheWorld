export type QuestionJSON = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
  type: 'text' | 'image' | 'video',
};

export type QuizJSON = QuestionJSON[];