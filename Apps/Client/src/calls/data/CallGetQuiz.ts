import CallGET from '../base/CallGET';

export class CallGetQuiz extends CallGET {

    constructor() {
        super('GetQuiz', `/quiz`);
    }
};