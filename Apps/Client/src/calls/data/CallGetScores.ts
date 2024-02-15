import { ScoreboardData } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

export class CallGetScores extends CallGET<void, ScoreboardData> {

    constructor() {
        super('GetScores', `/api/scores`);
    }
};