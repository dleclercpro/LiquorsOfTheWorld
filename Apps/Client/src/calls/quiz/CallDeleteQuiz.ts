import CallDELETE from '../base/CallDELETE';

export class CallDeleteQuiz extends CallDELETE {

    constructor(quizId: string) {
        super(`/quiz/${quizId}`);
    }
};