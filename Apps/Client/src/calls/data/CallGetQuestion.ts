import CallGET from '../base/CallGET';

export class CallGetQuestion extends CallGET {

    constructor(question: number = 0) {
        super('GetQuestion', `/question`);

        this.setPayload({
            question,
        });
    }
};