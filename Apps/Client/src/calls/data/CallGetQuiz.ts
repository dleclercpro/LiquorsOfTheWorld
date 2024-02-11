import { Quiz } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

export class CallGetQuiz extends CallGET<Quiz> {

    constructor() {
        super('GetQuiz', `/api/quiz`);
    }
};