import { QuizJSON } from '../../types/JSONTypes';
import CallGET from '../base/CallGET';

export class CallGetQuestions extends CallGET<void, QuizJSON> {

    constructor(lang: 'en' | 'de') {
        super(`/questions/${lang}`);
    }
};