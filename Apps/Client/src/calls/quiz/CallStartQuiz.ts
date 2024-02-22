import CallPUT from '../base/CallPUT';

type RequestData = {
    isSupervised: boolean,
};

export class CallStartQuiz extends CallPUT<RequestData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/start`);
    }
};