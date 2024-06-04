import { CallGetTeamsResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetTeams extends CallGET<void, CallGetTeamsResponseData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/teams`);
    }
};