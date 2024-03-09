import { GroupedScoreData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetScores extends CallGET<void, GroupedScoreData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/scores`);
    }
};