import { QuizName } from '../constants';
import TimeDuration from '../models/units/TimeDuration';
import { PlayerData } from './DataTypes';

export type Vote = {
  questionIndex: number,
  vote: number,
};

export type QuizStatus = {
  questionIndex: number,
  isStarted: boolean,
  isOver: boolean,
  isSupervised: boolean,
  timer: {
    isEnabled: boolean,
    startedAt?: Date,
    duration?: TimeDuration,
  },
}

export type QuizData = {
  name: QuizName,
  creator: string,
  players: PlayerData[],
  status: QuizStatus,
};

export type QuizTeam = {
  id: string,
  name: string,
};