import { Service } from '../../types/ServiceTypes';

class CallReady {
    protected url: string;

    public constructor(service: Service) {
        this.url = `${service.uri}/ready`;
    }

    public async execute() {
        const res = await fetch(this.url);

        return res;
    }
}

export default CallReady;