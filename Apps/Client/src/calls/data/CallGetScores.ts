import { Scores } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

export class CallGetScores extends CallGET<void, Scores> {

    constructor() {
        super('GetScores', `/scores`);
    }
};