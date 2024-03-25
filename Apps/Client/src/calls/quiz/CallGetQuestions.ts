import { Language, QuizName } from '../../constants';
import { QuizJSON } from '../../types/JSONTypes';
import CallGET from '../base/CallGET';

export class CallGetQuestions extends CallGET<void, QuizJSON> {

    constructor(lang: Language, quizName: QuizName) {
        super(`/questions/${lang}/${quizName}`);
    }
};