import { CallGetQuizListResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetQuizList extends CallGET<void, CallGetQuizListResponseData> {

    constructor() {
        super(`/quizzes`);
    }
};