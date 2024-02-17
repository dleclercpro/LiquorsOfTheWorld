import { ScoresData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetScores extends CallGET<void, ScoresData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/scores`);
    }
};