import { VersionData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetVersion extends CallGET<void, VersionData> {

    constructor() {
        super(`/version`);
    }
};