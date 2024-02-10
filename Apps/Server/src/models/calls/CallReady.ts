import { API_ROOT } from '../../config';

class CallReady {
    protected url: string;

    public constructor() {
        this.url = `${API_ROOT}/ready`;
    }

    public async execute() {
        const res = await fetch(this.url);

        return res;
    }
}

export default CallReady;