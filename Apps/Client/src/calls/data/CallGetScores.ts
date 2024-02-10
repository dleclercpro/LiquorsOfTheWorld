import CallGET from '../base/CallGET';

export class CallGetScores extends CallGET {

    constructor() {
        super('GetScores', `/scores`);
    }
};