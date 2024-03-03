import CallDELETE from '../base/CallDELETE';

export class CallDeleteDatabase extends CallDELETE {

    constructor() {
        super(`/`);
    }
};