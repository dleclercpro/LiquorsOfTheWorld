import { QuestionData } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

type RequestData = {
    questionIndex: number,
};

export class CallGetQuestion extends CallGET<RequestData, QuestionData> {

    constructor(questionIndex: number) {
        super('GetQuestion', `/api/quiz/${questionIndex}`);
    }
};