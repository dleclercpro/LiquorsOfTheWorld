import { LoginData } from '../../types/DataTypes';
import CallPUT from '../base/CallPUT';

export class CallLogIn extends CallPUT<LoginData> {

    constructor() {
        super(`/auth`);
    }
};