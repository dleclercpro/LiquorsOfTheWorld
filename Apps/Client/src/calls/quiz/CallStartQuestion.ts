import CallPUT from '../base/CallPUT';

export class CallStartQuestion extends CallPUT {

    constructor(quizId: string, questionIndex: number) {
        super(`/quiz/${quizId}/question/${questionIndex}/start`);
    }
};