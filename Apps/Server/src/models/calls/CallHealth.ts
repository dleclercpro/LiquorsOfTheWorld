import { Service } from '../../types/ServiceTypes';

class CallHealth {
    protected url: string;

    public constructor(service: Service) {
        this.url = `${service.uri}/health`;
    }

    public async execute() {
        const res = await fetch(this.url);

        return res;
    }
}

export default CallHealth;