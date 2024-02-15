import CallPUT from '../base/CallPUT';
import { Auth } from '../../types';
import { User } from '../../types/UserTypes';

export class CallLogIn extends CallPUT<Auth, User> {

    constructor(username: string, password: string) {
        super('Login', `/api/auth`, {
            username,
            password,
        });
    }
};