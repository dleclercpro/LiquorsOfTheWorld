import { LoginData, UserData } from '../../types/DataTypes';
import CallPUT from '../base/CallPUT';

export class CallLogIn extends CallPUT<LoginData, UserData> {

    constructor() {
        super(`/auth`);
    }
};