import { CallType } from '../../types/CallTypes';
import Call from './Call';

class CallPOST<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(url: string) {
        super(url, CallType.POST);
    }
}

export default CallPOST;