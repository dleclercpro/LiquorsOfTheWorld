import { QuestionIndexData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetQuestionIndex extends CallGET<void, QuestionIndexData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}`);
    }
};