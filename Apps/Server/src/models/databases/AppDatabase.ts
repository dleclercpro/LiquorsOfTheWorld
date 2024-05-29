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
                logger.trace(`Default admin user created: ${username}`);
            }
        });

        // Create regular users if they don't already exist
        USERS.forEach(async ({ username, password }) => {
            const user = await User.get(username);
        
            if (!user) {
                await User.create({ username, password }, false);
                logger.trace(`Default user created: ${username}`);
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


    
    public async getAllVotes(quizId: string) {
        const quiz = await Quiz.get(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        const questionCount = await QuizManager.count(quiz.getName());
        const players = quiz.getPlayers();
        
        // Initialize votes for all players
        const votes: Votes = players.reduce((prev, player) => {
            return {
                ...prev,
                [player.username]: new Array(questionCount).fill(NON_VOTE),
            };
        }, {});

        const votesAsStrings = await this.getKeysByPattern(`votes:${quizId}:*`);
    
        await Promise.all(votesAsStrings.map(async (voteAsString: string) => {
            const username = getLast(voteAsString.split(':')) as string;
    
            votes[username] = await this.getUserVotes(quizId, username);
        }));
    
        return votes;
    }

    public async getAllScores(quizId: string) {
        const quiz = await Quiz.get(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        const questions = await QuizManager.get(quiz.getName());
        const answers = questions.map((question) => question.answer);

        const scores = Object
            .entries(await this.getAllVotes(quizId))
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

    public async getUserVotes(quizId: string, username: string) {
        const votes = await this.get(`votes:${quizId}:${username.toLowerCase()}`);

        if (votes !== null) {
            return this.deserializeUserVotes(votes);
        }

        return [];
    }

    public async setUserVotes(quizId: string, username: string, votes: number[]) {
        await this.set(`votes:${quizId}:${username.toLowerCase()}`, votes.join(SEPARATOR));
    }

    protected deserializeUserVotes(votes: string) {
        return votes.split(SEPARATOR).map(Number);
    }

    public async getPlayersWhoVoted(quizId: string, questionIndex: number) {
        const votes = await this.getAllVotes(quizId);
        const players = Object.keys(votes);

        return players.filter((player) => votes[player][questionIndex] !== NON_VOTE);
    }
}

export default AppDatabase;