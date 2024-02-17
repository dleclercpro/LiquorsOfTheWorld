import { VotesData } from '../../types/DataTypes';
import CallPOST from '../base/CallPOST';

type RequestData = {
    vote: number,
};

export class CallVote extends CallPOST<RequestData, VotesData> {

    constructor(quizId: string, questionIndex: number) {
        super(`/quiz/${quizId}/question/${questionIndex}`);
    }
};