import { CallLogInRequestData, CallLogInResponseData } from '../../types/DataTypes';
import CallPUT from '../base/CallPUT';

export class CallLogIn extends CallPUT<CallLogInRequestData, CallLogInResponseData> {

    constructor() {
        super(`/auth`);
    }
};