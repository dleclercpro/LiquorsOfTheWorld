import TimeDuration from "../models/TimeDuration";
import { TimeUnit } from "../types/TimeTypes";

export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
};

export enum Language {
  EN = 'en',
  DE = 'de',
};

export enum QuizName {
  Liquors = 'liquors',
  KonnyUndJohannes = 'k-und-j',
}

export enum QuestionType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
};

export enum AspectRatio {
  Square = '1:1',
  FourByThree = '4:3',
  SixteenByNine = '16:9',
}

export const NO_TIME = new TimeDuration(0, TimeUnit.Millisecond);