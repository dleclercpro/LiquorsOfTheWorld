import { CallGetUserResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetUser extends CallGET<void, CallGetUserResponseData> {

    constructor() {
        super(`/user`);
    }
};