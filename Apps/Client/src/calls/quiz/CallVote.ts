import { CallVoteRequestData, CallVoteResponseData } from '../../types/DataTypes';
import CallPOST from '../base/CallPOST';

export class CallVote extends CallPOST<CallVoteRequestData, CallVoteResponseData> {

    constructor(quizId: string, questionIndex: number) {
        super(`/quiz/${quizId}/question/${questionIndex}`);
    }
};