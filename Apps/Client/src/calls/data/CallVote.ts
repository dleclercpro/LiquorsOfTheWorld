import { QuizVote } from '../../types';
import CallPOST from '../base/CallPOST';

export class CallVote extends CallPOST<QuizVote> {

    constructor(payload: QuizVote) {
        super('Vote', `/quiz/${payload.questionId}`, payload);
    }
};