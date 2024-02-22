export type QuizVote = {
  questionIndex: number,
  vote: number,
};

export type QuizScoreboard = Record<string, number>;

export type QuizGame = {
  creator: string,
  hasStarted: boolean,
  isOver: boolean,
  isSupervised: boolean,
  questionIndex: number,
  players: string[],
};