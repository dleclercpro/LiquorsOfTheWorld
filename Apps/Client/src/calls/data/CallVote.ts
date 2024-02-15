import { VoteData } from '../../types/QuizTypes';
import CallPOST from '../base/CallPOST';

export class CallVote extends CallPOST<VoteData> {

    constructor(questionIndex: number) {
        super('Vote', `/api/quiz/${questionIndex}`);
    }
};