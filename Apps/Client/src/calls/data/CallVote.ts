import { QuizVote } from '../../types/QuizTypes';
import CallPOST from '../base/CallPOST';

export class CallVote extends CallPOST<QuizVote> {

    constructor(payload: QuizVote) {
        super('Vote', `/quiz/${payload.questionId}`, payload);
    }
};