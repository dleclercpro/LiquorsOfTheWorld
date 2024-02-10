import CallPOST from '../base/CallPOST';

export class CallAddPlayer extends CallPOST {

    constructor(user: string) {
        super('AddPlayer', `/player`, {
            user,
        });
    }
};