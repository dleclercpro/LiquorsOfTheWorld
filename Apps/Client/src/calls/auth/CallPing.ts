import { CallPingResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallPing extends CallGET<void, CallPingResponseData> {

    constructor() {
        super(`/auth`);
    }
};