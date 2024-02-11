import { Vote } from '../../types/QuizTypes';
import CallPOST from '../base/CallPOST';

export class CallVote extends CallPOST<Vote> {

    constructor(payload: Vote) {
        super('Vote', `/api/quiz/${payload.questionIndex}`, payload);
    }
};