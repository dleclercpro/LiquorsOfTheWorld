import { CallGetScoresResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetScores extends CallGET<void, CallGetScoresResponseData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/scores`);
    }
};