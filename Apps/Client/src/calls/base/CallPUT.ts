import { CallType } from '../../types/CallTypes';
import Call from './Call';

class CallPUT<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(url: string) {
        super(url, CallType.PUT);
    }
}

export default CallPUT;