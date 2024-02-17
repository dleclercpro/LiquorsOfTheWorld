import { QuizJSON } from '../../types/JSONTypes';
import CallGET from '../base/CallGET';

export class CallGetQuiz extends CallGET<void, QuizJSON> {

    constructor() {
        super(`/quiz`);
    }
};