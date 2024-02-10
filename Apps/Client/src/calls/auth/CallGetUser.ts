import CallGET from '../base/CallGET';
import { SuccessResponse } from '../../types';

export class CallGetUser extends CallGET<void, SuccessResponse> {

    constructor() {
        super('GetUser', `/user`);
    }
};