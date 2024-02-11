import CallGET from '../base/CallGET';

export class CallGetUser extends CallGET {

    constructor() {
        super('GetUser', `/api/user`);
    }
};