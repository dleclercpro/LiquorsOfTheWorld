import { CallType } from '../../types/CallTypes';
import Call from './Call';

class CallPOST<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(name: string, url: string) {
        super(name, url, CallType.POST);
    }
}

export default CallPOST;