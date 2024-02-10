import { API_ROOT } from '../../config';

class CallHealth {
    protected url: string;

    public constructor() {
        this.url = `${API_ROOT}/health`;
    }

    public async execute() {
        const res = await fetch(this.url);

        return res;
    }
}

export default CallHealth;