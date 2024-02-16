import CallPUT from '../base/CallPUT';
import { LoginData } from '../../types';

export class CallLogIn extends CallPUT<LoginData> {

    constructor() {
        super(`/auth`);
    }
};