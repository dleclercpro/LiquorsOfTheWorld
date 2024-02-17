import { VoteData } from '../../types/DataTypes';
import CallPOST from '../base/CallPOST';

export class CallVote extends CallPOST<VoteData> {

    constructor(quizId: string, questionIndex: number) {
        super(`/quiz/${quizId}/question/${questionIndex}`);
    }
};