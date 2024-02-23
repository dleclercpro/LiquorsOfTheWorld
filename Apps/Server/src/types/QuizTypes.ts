export type Vote = {
  questionIndex: number,
  vote: number,
};

export type Quiz = {
  creator: string,
  hasStarted: boolean,
  isOver: boolean,
  isSupervised: boolean,
  questionIndex: number,
  players: string[],
};