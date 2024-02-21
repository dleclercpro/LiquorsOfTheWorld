import { StatusData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetStatus extends CallGET<void, StatusData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}`);
    }
};