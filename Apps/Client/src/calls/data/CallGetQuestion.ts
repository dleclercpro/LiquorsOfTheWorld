import { QuizQuestionResponse } from '../../types';
import CallGET from '../base/CallGET';

export type RequestDataCallGetQuestion = {
    questionId: number,
};

export class CallGetQuestion extends CallGET<RequestDataCallGetQuestion, QuizQuestionResponse> {

    constructor(questionId: number = 0) {
        super('GetQuestion', `/quiz/${questionId}`);
    }
};