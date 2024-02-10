import Call from './Call';
import { CallType } from '../../types';

class CallDELETE extends Call {

    constructor(name: string, url: string, payload: object) {
        super(name, url, CallType.DELETE, payload);
    }
}

export default CallDELETE;