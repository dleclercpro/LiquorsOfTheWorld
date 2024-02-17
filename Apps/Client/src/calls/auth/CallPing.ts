import { PingData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallPing extends CallGET<void, PingData> {

    constructor() {
        super(`/auth`);
    }
};