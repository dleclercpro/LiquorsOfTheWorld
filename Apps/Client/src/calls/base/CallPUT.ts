import { CallType } from '../../types/CallTypes';
import Call from './Call';

class CallPUT<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(name: string, url: string, payload: RequestData) {
        super(name, url, CallType.PUT, payload);
    }
}

export default CallPUT;