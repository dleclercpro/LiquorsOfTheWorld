import { QuizData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetQuiz extends CallGET<void, QuizData> {

    constructor() {
        super(`/quiz`);
    }
};