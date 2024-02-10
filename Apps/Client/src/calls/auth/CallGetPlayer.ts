import CallGET from '../base/CallGET';

export class CallGetPlayer extends CallGET {

    constructor() {
        super('GetPlayer', `/player`);
    }
};