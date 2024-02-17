import { VotesData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetVotes extends CallGET<void, VotesData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/votes`);
    }
};