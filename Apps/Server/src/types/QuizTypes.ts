import { QuizName } from "../constants";

export type Vote = {
  questionIndex: number,
  vote: number,
};

export type Quiz = {
  name: QuizName,
  creator: string,
  players: string[],
  status: {
    questionIndex: number,
    isStarted: boolean,
    isOver: boolean,
    isSupervised: boolean,
  },
};