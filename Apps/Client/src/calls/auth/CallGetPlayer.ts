import CallGET from '../base/CallGET';
import { SuccessResponse } from '../../types';

export class CallGetPlayer extends CallGET<void, SuccessResponse> {

    constructor() {
        super('GetPlayer', `/player`);
    }
};