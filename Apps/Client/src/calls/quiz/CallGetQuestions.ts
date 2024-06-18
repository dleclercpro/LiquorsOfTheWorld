import { Language } from '../../constants';
import { CallGetQuestionsResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetQuestions extends CallGET<void, CallGetQuestionsResponseData> {

    constructor(language: Language, quizId: string) {
        super(`/quiz/${quizId}/questions/${language}`);
    }
};