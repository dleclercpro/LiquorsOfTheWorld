import CallPUT from '../base/CallPUT';
import { Auth } from '../../types';

export class CallLogin extends CallPUT<Auth, void> {

    constructor(username: string, password: string) {
        super('Login', `/auth`, {
            username,
            password,
        });
    }
};