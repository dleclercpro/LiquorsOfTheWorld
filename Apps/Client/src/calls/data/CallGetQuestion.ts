import { QuestionData } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

export type RequestDataCallGetQuestion = {
    questionId: number,
};

export class CallGetQuestion extends CallGET<RequestDataCallGetQuestion, QuestionData> {

    constructor(questionId: number = 0) {
        super('GetQuestion', `/quiz/${questionId}`);
    }
};