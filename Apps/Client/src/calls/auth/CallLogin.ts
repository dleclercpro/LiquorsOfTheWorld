import CallPUT from '../base/CallPUT';
import { Auth } from '../../types';

export class CallLogIn extends CallPUT<Auth> {

    constructor(username: string, password: string) {
        super('Login', `/api/auth`, {
            username,
            password,
        });
    }
};