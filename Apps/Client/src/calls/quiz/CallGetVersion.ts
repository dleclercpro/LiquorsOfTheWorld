import { CallGetVersionResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetVersion extends CallGET<void, CallGetVersionResponseData> {

    constructor() {
        super(`/version`);
    }
};