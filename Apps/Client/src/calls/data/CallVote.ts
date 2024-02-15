import { VoteData } from '../../types/QuizTypes';
import CallPOST from '../base/CallPOST';

export class CallVote extends CallPOST<VoteData> {

    constructor(payload: VoteData) {
        super('Vote', `/api/quiz/${payload.questionIndex}`, payload);
    }
};