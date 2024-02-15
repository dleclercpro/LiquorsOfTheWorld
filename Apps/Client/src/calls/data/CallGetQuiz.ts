import { QuizData } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

export class CallGetQuiz extends CallGET<void, QuizData> {

    constructor() {
        super('GetQuiz', `/api/quiz`);
    }
};