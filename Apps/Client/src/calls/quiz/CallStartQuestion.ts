import { CallStartQuestionResponseData } from '../../types/DataTypes';
import CallPUT from '../base/CallPUT';

export class CallStartQuestion extends CallPUT<void, CallStartQuestionResponseData> {

    constructor(quizId: string, questionIndex: number) {
        super(`/quiz/${quizId}/question/${questionIndex}`);
    }
};