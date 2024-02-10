import Call from './Call';
import { CallType } from '../../types';

class CallPUT extends Call {

    constructor(name: string, url: string, payload: object) {
        super(name, url, CallType.PUT, payload);
    }
}

export default CallPUT;