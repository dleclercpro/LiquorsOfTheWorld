import Call from './Call';
import { CallType } from '../../types';

class CallPUT<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(name: string, url: string, payload: RequestData) {
        super(name, url, CallType.PUT, payload);
    }
}

export default CallPUT;