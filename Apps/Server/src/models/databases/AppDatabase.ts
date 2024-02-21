import bcrypt from 'bcrypt';
import { N_SALT_ROUNDS } from '../../config';
import { ANSWERS, QUESTIONS } from '../../constants';
import logger from '../../logger';
import { getLastValue, unique } from '../../utils/array';
import { sum } from '../../utils/math';
import RedisDatabase from './base/RedisDatabase';
import { DatabaseUser } from '../../types/UserTypes';
import { randomUUID } from 'crypto';
import { QuizGame } from '../../types/QuizTypes';

const SEPARATOR = '|';

type Votes = Record<string, number[]>;



class AppDatabase extends RedisDatabase {

    public async doesQuizExist(quizId: string) {
        return this.has(`quiz:${quizId}`);
    }

    public async doesUserExist(username: string) {
        return this.has(`users:${username}`);
    }

    public async isUserPlaying(quizId: string, username: string) {
        const players = await this.getAllPlayers(quizId);

        return players.includes(username);
    }

    public async addUserToQuiz(quizId: string, username: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new Error('INVALID_QUIZ_ID');
        }

        await this.updateQuiz(quizId, {
            ...quiz,
            players: unique([...quiz.players, username]),
        });
    }

    public async createUser(username: string, password: string) {
        const hashedPassword = await new Promise<string>((resolve, reject) => {
            bcrypt.hash(password, N_SALT_ROUNDS, async (err, hash) => {
                if (err) {
                    logger.fatal(`Cannot hash password of user '${username}'.`, err);
                    reject(new Error('CANNOT_HASH_PASSWORD'));
                }
      
                resolve(hash);
            });
        });
      
        logger.trace(`Creating user '${username}'...`);
        const user = { username, hashedPassword };
      
        await this.set(`users:${username}`, this.serializeUser(user));
      
        return user;
    }

    public async createQuiz(quizId: string, username: string) {
        logger.trace(`Creating a new game...`);

        if (await this.doesQuizExist(quizId)) {
            throw new Error('QUIZ_ID_ALREADY_EXISTS');
        }

        const quiz: QuizGame = {
            creator: username,
            questionIndex: 0,
            hasStarted: false,
            isOver: false,
            players: [],
        };

        await this.set(`quiz:${quizId}`, this.serializeQuiz(quiz));

        return quiz;
    }

    public async startQuiz(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new Error('INVALID_QUIZ_ID');
        }

        await this.updateQuiz(quizId, {
            ...quiz,
            hasStarted: true,
        });
    }

    public async getUser(username: string) {
        return this.get(`users:${username}`);
    }

    public async getAllUsers() {
        return this.getKeysByPattern(`users:*`);
    }

    public async getAllPlayers(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new Error('INVALID_QUIZ_ID');
        }

        return quiz.players;
    }

    public async getQuiz(quizId: string) {
        const quiz = await this.get(`quiz:${quizId}`);

        if (quiz === null) {
            return;
        }

        return this.deserializeQuiz(quiz);
    }

    public async updateQuiz(quizId: string, updatedQuiz: QuizGame) {
        if (!await this.doesQuizExist(quizId)) {
            throw new Error('INVALID_QUIZ_ID');
        }

        await this.set(`quiz:${quizId}`, this.serializeQuiz(updatedQuiz));
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

    public async getPlayersWhoVotedUpUntil(quizId: string, questionIndex: number) {
        const votes = await this.getAllVotes(quizId);
        const users = Object.keys(votes);

        return users.filter(user => votes[user].length >= questionIndex + 1);
    }

    public async getQuestionIndex(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new Error('INVALID_QUIZ_ID');
        }

        return quiz.questionIndex;
    }

    public async setQuestionIndex(quizId: string, questionIndex: number) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new Error('INVALID_QUIZ_ID');
        }
        
        await this.updateQuiz(quizId, { ...quiz, questionIndex });
    }

    public async incrementQuestionIndex(quizId: string) {
        const questionIndex = await this.getQuestionIndex(quizId);
        const quiz = await this.getQuiz(quizId) as QuizGame;

        if (questionIndex + 1 === QUESTIONS.length) {
            await this.updateQuiz(quizId, {
                ...quiz,
                isOver: true,
            });
        } else {
            await this.setQuestionIndex(quizId, questionIndex + 1);
        }
    }

    public async generateQuizId() {
        let quizId = '';

        // Generate a new unique ID for the quiz
        while (!quizId || await this.doesQuizExist(quizId)) {
            quizId = randomUUID();
        }

        return quizId;
    }

    protected serializeUser(user: DatabaseUser) {
        return JSON.stringify(user);
    }

    protected deserializeUser(user: string) {
        return JSON.parse(user) as DatabaseUser;
    }

    protected serializeQuiz(quiz: QuizGame) {
        return JSON.stringify(quiz);
    }

    protected deserializeQuiz(quiz: string) {
        return JSON.parse(quiz) as QuizGame;
    }
}

export default AppDatabase;