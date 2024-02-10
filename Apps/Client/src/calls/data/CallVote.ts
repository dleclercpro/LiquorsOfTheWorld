import { Vote } from '../../types/QuizTypes';
import CallPOST from '../base/CallPOST';

export class CallVote extends CallPOST<Vote> {

    constructor(payload: Vote) {
        super('Vote', `/quiz/${payload.questionId}`, payload);
    }
};