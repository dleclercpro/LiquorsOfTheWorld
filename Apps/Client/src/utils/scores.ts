import { ScoreData } from '../types/DataTypes';

type Score = {
  username: string,
  score: ScoreData,
};

export class ScoreComparator {
  public static compare(a: Score, b: Score) {
    if (a.score.right < b.score.right) return 1;
    if (a.score.right > b.score.right) return -1;
    return 0;
  }
}