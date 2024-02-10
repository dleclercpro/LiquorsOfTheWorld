import CallGET from '../base/CallGET';

export class CallGetUser extends CallGET {

    constructor() {
        super('GetUser', `/user`);
    }
};