import Call from './Call';
import { CallType } from '../../types';

class CallDELETE<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(name: string, url: string, payload: RequestData) {
        super(name, url, CallType.DELETE, payload);
    }
}

export default CallDELETE;