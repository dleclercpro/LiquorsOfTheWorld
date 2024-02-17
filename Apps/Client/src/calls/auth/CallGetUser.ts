import { UserData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetUser extends CallGET<void, UserData> {

    constructor() {
        super(`/user`);
    }
};