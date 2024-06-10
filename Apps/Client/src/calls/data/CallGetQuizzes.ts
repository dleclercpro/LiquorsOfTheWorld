import { CallGetQuizzesResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetQuizzes extends CallGET<void, CallGetQuizzesResponseData> {

    constructor() {
        super(`/quizzes`);
    }
};