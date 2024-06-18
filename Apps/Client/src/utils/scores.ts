import { ScoreData } from '../types/DataTypes';

type UsernameAndScore = {
  username: string,
  score: ScoreData,
};

export class ScoreComparator {
  public static compare(a: UsernameAndScore, b: UsernameAndScore, order: 'ASC' | 'DESC' = 'ASC') {
    if (a.score.right < b.score.right) return order === 'ASC' ? -1 : 1;
    if (a.score.right > b.score.right) return order === 'ASC' ? 1 : -1;
    return 0;
  }
}