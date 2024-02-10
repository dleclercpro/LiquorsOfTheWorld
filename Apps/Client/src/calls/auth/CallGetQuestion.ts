import CallGET from '../base/CallGET';

export class CallGetQuestion extends CallGET {

    constructor() {
        super('GetQuestion', `/question`);
    }
};