import { CallGetQuizNamesResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetQuizNames extends CallGET<void, CallGetQuizNamesResponseData> {

    constructor() {
        super(`/quiz`);
    }
};