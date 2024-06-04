import { Language, QuizName } from '../../constants';
import { CallGetQuestionsResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetQuestions extends CallGET<void, CallGetQuestionsResponseData> {

    constructor(language: Language, quizName: QuizName) {
        super(`/questions/${language}/${quizName}`);
    }
};