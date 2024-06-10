import { ADMINS, REDIS_DATABASE, REDIS_ENABLE, REDIS_OPTIONS, USERS } from '../../config';
import RedisDatabase from './base/RedisDatabase';
import QuizManager from '../QuizManager';
import MemoryDatabase from './base/MemoryDatabase';
import User from '../users/User';
import Quiz from '../Quiz';
import { NO_VOTE_INDEX, USER_TYPES, UserType } from '../../constants';
import { GroupedScoresData, GroupedVotesData } from '../../types/DataTypes';

const SEPARATOR = '|';

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
                await User.create({ username, password }, UserType.Admin);
            }
        });

        // Create regular users if they don't already exist
        USERS.forEach(async ({ username, password }) => {
            const user = await User.get(username);
        
            if (!user) {
                await User.create({ username, password }, UserType.Regular);
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


    
    public async getAllVotes(quiz: Quiz): Promise<GroupedVotesData> {
        const votes: GroupedVotesData = { [UserType.Regular]: {}, [UserType.Admin]: {} };

        for (const player of quiz.getPlayers()) {
            const user = await User.get(player.username) as User;
            
            votes[user.getType()][player.username] = await this.getUserVotes(quiz, player.username);
        }
        
        return votes;
    }

    public async getAllScores(quiz: Quiz): Promise<GroupedScoresData> {
        const scores: GroupedScoresData = { [UserType.Regular]: {}, [UserType.Admin]: {} };

        for (const player of quiz.getPlayers()) {
            const user = await User.get(player.username) as User;

            scores[user.getType()][player.username] = await this.getUserScores(quiz, user);
        }
    
        return scores;
    }

    public async getUserScores(quiz: Quiz, user: User) {
        const votes = await this.getAllVotes(quiz);
        const questions = await QuizManager.get(quiz.getName());
        const answers = questions.map((question) => question.answer);

        const userVotes = votes[user.getType()][user.getUsername()];

        return {
            total: userVotes
                .filter((vote) => vote !== NO_VOTE_INDEX).length,
            value: answers
                .filter((answerIndex, i) => answerIndex === userVotes[i])
                .length
        };
    }

    public async getUserVotes(quiz: Quiz, username: string) {
        const votesAsString = await this.get(`votes:${quiz.getId()}:${username}`);

        if (votesAsString !== null) {
            return this.deserializeUserVotes(votesAsString);
        } else {
            // FIXME: ensure user exists and data is not created for no reason!
            return await this.createInitialVotes(quiz);
        }
    }

    public async setUserVotes(quiz: Quiz, username: string, votes: number[]) {
        await this.set(`votes:${quiz.getId()}:${username}`, this.serializeUserVotes(votes));
    }

    public async createInitialVotes(quiz: Quiz) {
        const questionCount = await QuizManager.count(quiz.getName());
            
        const votes: number[] = new Array(questionCount).fill(NO_VOTE_INDEX);
        
        return votes;
    }

    protected serializeUserVotes(votes: number[]) {
        return votes.join(SEPARATOR);
    }

    protected deserializeUserVotes(votes: string) {
        return votes.split(SEPARATOR).map(Number);
    }

    public async getUsernamesOfPlayersWhoVoted(quiz: Quiz, questionIndex: number) {
        const votes = await this.getAllVotes(quiz);

        let usernamesOfPlayersWhoVoted: string[] = [];

        for (const userType of USER_TYPES) {
            const allVotesForUserType = Object.entries(votes[userType]);

            usernamesOfPlayersWhoVoted = [
                ...usernamesOfPlayersWhoVoted, 
                ...allVotesForUserType
                    .filter(([_, playerVotes]) => playerVotes[questionIndex] !== NO_VOTE_INDEX)
                    .map(([player, _]) => player),
            ];
        }

        return usernamesOfPlayersWhoVoted;
    }
}

export default AppDatabase;