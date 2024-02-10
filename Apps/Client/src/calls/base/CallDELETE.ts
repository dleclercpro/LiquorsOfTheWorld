import { CallType } from '../../types/CallTypes';
import Call from './Call';

class CallDELETE<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(name: string, url: string, payload: RequestData) {
        super(name, url, CallType.DELETE, payload);
    }
}

export default CallDELETE;