import CallPUT from '../base/CallPUT';
import { Auth } from '../../types';
import { User } from '../../types/UserTypes';

export class CallLogIn extends CallPUT<Auth, User> {

    constructor() {
        super('Login', `/api/auth`);
    }
};