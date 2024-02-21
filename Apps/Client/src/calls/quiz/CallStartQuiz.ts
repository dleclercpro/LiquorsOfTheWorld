import CallPUT from '../base/CallPUT';

export class CallStartQuiz extends CallPUT {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/start`);
    }
};