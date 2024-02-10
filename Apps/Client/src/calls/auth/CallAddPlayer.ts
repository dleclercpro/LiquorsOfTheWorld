import CallPOST from '../base/CallPOST';
import { Auth } from '../../types';

export class CallAddPlayer extends CallPOST<Auth, void> {

    constructor(user: string, password: string) {
        super('AddPlayer', `/player`, {
            user,
            password,
        });
    }
};