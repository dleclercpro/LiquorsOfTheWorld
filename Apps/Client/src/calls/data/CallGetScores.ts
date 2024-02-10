import { QuizScoreboard } from '../../types/QuizTypes';
import CallGET from '../base/CallGET';

export class CallGetScores extends CallGET<void, QuizScoreboard> {

    constructor() {
        super('GetScores', `/scores`);
    }
};