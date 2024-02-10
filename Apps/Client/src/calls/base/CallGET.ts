import Call from './Call';
import { CallType } from '../../types';

class CallGET<RequestData = void, ResponseData = void> extends Call<RequestData, ResponseData> {

    constructor(name: string, url: string) {
        super(name, url, CallType.GET);
    }
}

export default CallGET;