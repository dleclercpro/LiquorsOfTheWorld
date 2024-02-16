import { getLastValue } from '../../utils/array';
import RedisDatabase from './base/RedisDatabase';

const SEPARATOR = '|';

type Votes = Record<string, number[]>;



class AppDatabase extends RedisDatabase {

    protected deserializeUserVotes(votes: string) {
        return votes.split(SEPARATOR).map(Number);
    }

    public async getUserVotes(quizId: string, username: string) {
        const votes = await this.get(`votes:${quizId}:${username}`);

        if (votes !== null) {
            return this.deserializeUserVotes(votes);
        }

        return [];
    }
    
    public async getAllVotes(quizId: string) {
        const votes: Votes = {};
        const votesAsStrings = await this.getKeysByPattern(`votes:${quizId}:*`);
    
        await Promise.all(votesAsStrings.map(async (voteAsString: string) => {
            const username = getLastValue(voteAsString.split(':')) as string;
    
            votes[username] = await this.getUserVotes(quizId, username);
        }));
    
        return votes;
    }
}

export default AppDatabase;