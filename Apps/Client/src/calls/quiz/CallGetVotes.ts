import { CallGetVotesResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetVotes extends CallGET<void, CallGetVotesResponseData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/votes`);
    }
};