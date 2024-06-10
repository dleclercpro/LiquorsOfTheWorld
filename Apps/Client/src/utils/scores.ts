import { ScoreData } from '../types/DataTypes';

type Score = {
  username: string,
  score: ScoreData,
};

export class ScoreComparator {
  public static compare(a: Score, b: Score) {
    if (a.score.value < b.score.value) return 1;
    if (a.score.value > b.score.value) return -1;
    return 0;
  }
}