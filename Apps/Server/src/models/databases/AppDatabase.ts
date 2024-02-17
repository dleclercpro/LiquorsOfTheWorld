import bcrypt from 'bcrypt';
import { N_SALT_ROUNDS } from '../../config';
import { ANSWERS } from '../../constants';
import logger from '../../logger';
import { getLastValue } from '../../utils/array';
import { sum } from '../../utils/math';
import RedisDatabase from './base/RedisDatabase';
import { DatabaseUser } from '../../types/UserTypes';

const SEPARATOR = '|';

type Votes = Record<string, number[]>;



class AppDatabase extends RedisDatabase {

    public async doesQuizExist(quizId: string) {
        return this.has(`quiz:${quizId}`);
    }

    public async doesUserExist(username: string) {
        return this.has(`users:${username}`);
    }

    public async createUser(username: string, password: string) {
        logger.trace(`Adding user '${username}' to Redis DB...`);

        // Hash the password
        const hashedPassword = await new Promise<string>((resolve, reject) => {
            bcrypt.hash(password, N_SALT_ROUNDS, async (err, hash) => {
                if (err) {
                    logger.fatal(`Error while hashing password of user '${username}'.`, err);
                    reject(new Error('CANNOT_HASH_PASSWORD'));
                }
      
                resolve(hash);
            });
        });
      
        logger.trace(`Creating user '${username}' in database...`);
        const user = { username, hashedPassword, questionIndex: 0 };
      
        await this.set(`users:${username}`, JSON.stringify(user as DatabaseUser));
      
        return user;
    }

    public async getUser(username: string) {
        return this.get(`users:${username}`);
    }

    public async getAllUsers() {
        return this.getKeysByPattern(`users:*`);
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

    public async getAllScores(quizId: string) {
        const votes = await this.getAllVotes(quizId);

        const scores = Object.entries(votes)
            .reduce((prev, [username, vote]) => {
                const userScore = sum(ANSWERS
                    .map((ans, i) => i < vote.length && ans === vote[i])
                    .map(Number));
        
                return {
                    ...prev,
                    [username]: userScore,
                };
            }, {});
    
        return scores;
    }

    public async getUserVotes(quizId: string, username: string) {
        const votes = await this.get(`votes:${quizId}:${username}`);

        if (votes !== null) {
            return this.deserializeUserVotes(votes);
        }

        return [];
    }

    public async setUserVotes(quizId: string, username: string, votes: number[]) {
        await this.set(`votes:${quizId}:${username}`, votes.join(SEPARATOR));
    }

    protected deserializeUserVotes(votes: string) {
        return votes.split(SEPARATOR).map(Number);
    }

    public async getUsersWhoVoted(quizId: string) {
        return Object.keys(await this.getAllVotes(quizId));
    }

    public async getQuestionIndex(quizId: string) {
        const questionIndex = await this.get(`quiz:${quizId}`);

        if (questionIndex === null) {
            throw new Error('INVALID_QUIZ_ID');
        }
    
        return Number(questionIndex);
    }

    public async setQuestionIndex(quizId: string, questionIndex: number) {
        await this.set(`quiz:${quizId}`, String(questionIndex));
    }

    public async incrementQuestionIndex(quizId: string) {
        const questionIndex = await this.getQuestionIndex(quizId);

        await this.setQuestionIndex(quizId, questionIndex + 1);
    }
}

export default AppDatabase;