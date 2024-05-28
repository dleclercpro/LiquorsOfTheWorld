import { CallStartQuizRequestData } from '../../types/DataTypes';
import CallPUT from '../base/CallPUT';

export class CallStartQuiz extends CallPUT<CallStartQuizRequestData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}`);
    }
};