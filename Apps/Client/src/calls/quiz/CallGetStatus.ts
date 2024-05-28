import { CallGetStatusResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetStatus extends CallGET<void, CallGetStatusResponseData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}`);
    }
};