import { CallGetPlayersResponseData } from '../../types/DataTypes';
import CallGET from '../base/CallGET';

export class CallGetPlayers extends CallGET<void, CallGetPlayersResponseData> {

    constructor(quizId: string) {
        super(`/quiz/${quizId}/players`);
    }
};