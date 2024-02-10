import { QuizData } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

export class CallGetQuiz extends CallGET<QuizData> {

    constructor() {
        super('GetQuiz', `/quiz`);
    }
};