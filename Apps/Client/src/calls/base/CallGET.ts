import Call from './Call';
import { CallType } from '../../types';

class CallGET extends Call {

    constructor(name: string, url: string) {
        super(name, url, CallType.GET);
    }
}

export default CallGET;