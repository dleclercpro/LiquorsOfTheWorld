import CallGET from '../base/CallGET';

export class CallGetQuizNames extends CallGET<void, string[]> {

    constructor() {
        super(`/quiz`);
    }
};