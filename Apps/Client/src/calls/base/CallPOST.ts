import Call from './Call';
import { CallType } from '../../types';

class CallPOST<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(name: string, url: string, payload: RequestData) {
        super(name, url, CallType.POST, payload);
    }
}

export default CallPOST;