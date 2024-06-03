import { ADMINS, REDIS_DATABASE, REDIS_ENABLE, REDIS_OPTIONS, USERS } from '../../config';
import logger from '../../logger';
import { getLast, getRange } from '../../utils/array';
import { sum } from '../../utils/math';
import RedisDatabase from './base/RedisDatabase';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import QuizManager from '../QuizManager';
import MemoryDatabase from './base/MemoryDatabase';
import User from '../users/User';
import Quiz from '../Quiz';
import { NON_VOTE } from '../../constants';
import { VotesData } from '../../types/DataTypes';

const SEPARATOR = '|';

type Votes = Record<string, number[]>;



class AppDatabase {
    private db: RedisDatabase | MemoryDatabase<string>;

    public constructor() {
        this.db = (REDIS_ENABLE ?
            new RedisDatabase(REDIS_OPTIONS, REDIS_DATABASE) :
            new MemoryDatabase<string>() // Fallback database: in-memory
        );
    }

    
    public async setup() {

        // Create admin users if they don't already exist
        ADMINS.forEach(async ({ username, password }) => {
            const admin = await User.get(username);
        
            if (!admin) {
                await User.create({ username, password }, true);
            }
        });

        // Create regular users if they don't already exist
        USERS.forEach(async ({ username, password }) => {
            const user = await User.get(username);
        
            if (!user) {
                await User.create({ username, password }, false);
            }
        });
    }

    public async start() {
        if (!this.db) throw new Error('MISSING_DATABASE');

        await this.db.start();
    }

    public async stop() {
        if (!this.db) throw new Error('MISSING_DATABASE');

        await this.db.stop();
    }

    public async has(key: string) {
        return this.db.has(key);
    }

    public async get(key: string) {
        return this.db.get(key);
    }

    public async set(key: string, value: string) {
        return this.db.set(key, value);
    }

    public async delete(key: string) {
        return this.db.delete(key);
    }

    public async flush() {
        return this.db.flush();
    }

    public async getAllKeys() {
        return this.db.getAllKeys();
    }

    public async getAllValues() {
        return this.db.getAllValues();
    }

    public async getKeysByPattern(pattern: string) {
        const keys = await this.db.getKeysByPattern(pattern);

        if (!keys) {
            return [];
        }

        return keys;
    }


    
    public async getAllVotes(quiz: Quiz): Promise<Record<string, VotesData>> {
        const votesAsStrings = await this.getKeysByPattern(`votes:${quiz.getId()}:*`);
        
        const votes: Record<string, VotesData> = {};
    
        for (const voteAsString of votesAsStrings) {
            const username = getLast(voteAsString.split(':')) as string;
            votes[username] = await this.getUserVotes(quiz, username);
        }
        
        return votes;
    }

    public async getAllScores(quiz: Quiz) {
        const questions = await QuizManager.get(quiz.getName());
        const answers = questions.map((question) => question.answer);

        const scores = Object
            .entries(await this.getAllVotes(quiz))
            .reduce((prev, [player, votes]) => {
                const score = sum(
                    answers
                        .map((answerIndex, i) => answerIndex === votes[i])
                        .map(Number)
                );
        
                return {
                    ...prev,
                    [player]: score,
                };
            }, {});
    
        return scores;
    }

    public async getUserVotes(quiz: Quiz, username: string) {
        const votesAsString = await this.get(`votes:${quiz.getId()}:${username}`);

        if (votesAsString !== null) {
            return this.deserializeUserVotes(votesAsString);
        } else {
            return await this.createInitialVotes(quiz);
        }
    }

    public async setUserVotes(quiz: Quiz, username: string, votes: number[]) {
        await this.set(`votes:${quiz.getId()}:${username}`, this.serializeUserVotes(votes));
    }

    protected async createInitialVotes(quiz: Quiz) {
        const questionCount = await QuizManager.count(quiz.getName());
            
        const votes: number[] = new Array(questionCount).fill(NON_VOTE);
        
        return votes;
    }

    protected serializeUserVotes(votes: number[]) {
        return votes.join(SEPARATOR);
    }

    protected deserializeUserVotes(votes: string) {
        return votes.split(SEPARATOR).map(Number);
    }

    public async getPlayersWhoVoted(quiz: Quiz, questionIndex: number) {
        const votes = await this.getAllVotes(quiz);
        const playerIndexes = Object.keys(votes);

        return playerIndexes.filter((playerIndex) => votes[playerIndex][questionIndex] !== NON_VOTE);
    }
}

export default AppDatabase;