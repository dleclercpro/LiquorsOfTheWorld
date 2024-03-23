import { QuizName } from '../../constants';
import CallGET from '../base/CallGET';

export class CallGetBackgroundUrl extends CallGET<void, string> {

    constructor(quizName: QuizName) {
        super(`/bg/${quizName}`);
    }
};