import { Question } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

export type RequestDataCallGetQuestion = {
    questionIndex: number,
};

export class CallGetQuestion extends CallGET<RequestDataCallGetQuestion, Question> {

    constructor(questionIndex: number) {
        super('GetQuestion', `/api/quiz/${questionIndex}`);
    }
};