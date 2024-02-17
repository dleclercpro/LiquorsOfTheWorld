import CallGET from '../base/CallGET';

export class CallGetVotes extends CallGET<void, number[]> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/votes`);
    }
};