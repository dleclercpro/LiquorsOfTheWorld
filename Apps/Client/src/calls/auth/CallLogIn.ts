import { CallLogInResponseData, LoginData } from '../../types/DataTypes';
import CallPUT from '../base/CallPUT';

export class CallLogIn extends CallPUT<LoginData, CallLogInResponseData> {

    constructor() {
        super(`/auth`);
    }
};