import { ScoreData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetScores extends CallGET<void, ScoreData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/scores`);
    }
};