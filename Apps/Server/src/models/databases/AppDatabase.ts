import bcrypt from 'bcrypt';
import { ADMINS, N_SALT_ROUNDS, REDIS_DATABASE, REDIS_ENABLE, REDIS_OPTIONS, TIMER_DURATION, USERS } from '../../config';
import { QUIZ_NAMES, QuizName } from '../../constants';
import logger from '../../logger';
import { getLast, getRange, unique } from '../../utils/array';
import { sum } from '../../utils/math';
import RedisDatabase from './base/RedisDatabase';
import { DatabaseUser } from '../../types/UserTypes';
import { randomUUID } from 'crypto';
import { Quiz } from '../../types/QuizTypes';
import QuizAlreadyExistsError from '../../errors/QuizAlreadyExistsError';
import HashError from '../../errors/HashError';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidQuestionIndexError from '../../errors/InvalidQuestionIndexError';
import QuizManager from '../QuizManager';
import InvalidQuizNameError from '../../errors/InvalidQuizNameError';
import MemoryDatabase from './base/MemoryDatabase';
import TimeDuration from '../units/TimeDuration';

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
            const admin = await this.getUser(username);
        
            if (!admin) {
                await this.createUser(username, password, true);
                logger.trace(`Default admin user created: ${username}`);
            }
        });

        // Create regular users if they don't already exist
        USERS.forEach(async ({ username, password }) => {
            const user = await this.getUser(username);
        
            if (!user) {
                await this.createUser(username, password, true);
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


    
    public async doesQuizExist(quizId: string) {
        return this.has(`quiz:${quizId}`);
    }

    public async doesUserExist(username: string) {
        return this.has(`users:${username.toLowerCase()}`);
    }

    public async isUserPlaying(quizId: string, username: string) {
        const players = await this.getAllPlayers(quizId);

        return players.includes(username.toLowerCase());
    }

    public async addUserToQuiz(quizId: string, username: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        await this.setQuiz(quizId, {
            ...quiz,
            players: unique([...quiz.players, username.toLowerCase()]),
        });
    }

    public async createUser(username: string, password: string, isAdmin: boolean = false) {
        const lowercaseUsername = username.toLowerCase();

        const hashedPassword = await new Promise<string>((resolve, reject) => {
            bcrypt.hash(password, N_SALT_ROUNDS, async (err, hash) => {
                if (err) {
                    logger.error(`Cannot hash password of user '${lowercaseUsername}'.`, err);
                    reject(new HashError());
                }
      
                resolve(hash);
            });
        });
      
        logger.trace(`Creating user '${lowercaseUsername}'...`);
        const user = {
            username: lowercaseUsername,
            isAdmin,
            hashedPassword,
        };
      
        await this.set(`users:${lowercaseUsername}`, this.serializeUser(user));
      
        return user;
    }

    public async createQuiz(quizId: string, quizName: QuizName, username: string) {
        logger.trace(`Creating a new quiz...`);

        if (!QUIZ_NAMES.includes(quizName)) {
            throw new InvalidQuizNameError();
        }

        if (await this.doesQuizExist(quizId)) {
            throw new QuizAlreadyExistsError();
        }

        const quiz: Quiz = {
            name: quizName,
            creator: username.toLowerCase(),
            players: [],
            status: {
                questionIndex: 0,
                isStarted: false,
                isOver: false,
                isSupervised: false,
                timer: {
                    isEnabled: false,
                },
            },
        };

        await this.set(`quiz:${quizId}`, this.serializeQuiz(quiz));

        return quiz;
    }

    public async startQuiz(quizId: string, isSupervised: boolean, isTimed: boolean) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        await this.setQuiz(quizId, {
            ...quiz,
            status: {
                ...quiz.status,
                isStarted: true,
                isSupervised,
                timer: {
                    isEnabled: isTimed,
                    ...(isTimed ? {
                        duration: TIMER_DURATION,
                        startedAt: new Date(),
                    } : {}),
                },
            },
        });
    }

    public async deleteQuiz(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        const players = await this.getAllPlayers(quizId);

        // Delete all votes associated with quiz
        await Promise.all(players.map((player) => this.delete(`votes:${quizId}:${player}`)));

        await this.delete(`quiz:${quizId}`);
    }

    public async getUser(username: string) {
        const user = await this.get(`users:${username.toLowerCase()}`);

        if (!user) {
            return null;
        }

        return this.deserializeUser(user);
    }

    public async getAllUsers() {
        return this.getKeysByPattern(`users:*`);
    }

    public async getAllPlayers(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
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

    public async setQuiz(quizId: string, updatedQuiz: Quiz) {
        if (!await this.doesQuizExist(quizId)) {
            throw new InvalidQuizIdError();
        }

        await this.set(`quiz:${quizId}`, this.serializeQuiz(updatedQuiz));
    }

    public async getQuizStatus(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        const players = await this.getAllPlayers(quizId);
        const votesCount = await this.getVotesCount(quizId);

        const { status } = quiz;
        
        // FIXME
        // Return players as part of a 'status' object, but they aren't part of it
        // in the data model
        return {
            ...status,
            players,
            votesCount,
        };
    }

    public async getVotesCount(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        const votesCount = new Array(QuizManager.count(quiz.name)).fill(0);

        const votes = await this.getAllVotes(quizId);
        const players = Object.keys(votes);

        players.forEach((player) => {
            const playerVoteCount = votes[player].length;

            getRange(playerVoteCount).forEach((i) => {
                votesCount[i] += 1;
            });
        });

        return votesCount;
    }
    
    public async getAllVotes(quizId: string) {
        const players = await this.getAllPlayers(quizId);
        
        // Initialize votes for all players
        const votes: Votes = players.reduce((prev, player) => {
            return { ...prev, [player]: [] };
        }, {});

        const votesAsStrings = await this.getKeysByPattern(`votes:${quizId}:*`);
    
        await Promise.all(votesAsStrings.map(async (voteAsString: string) => {
            const username = getLast(voteAsString.split(':')) as string;
    
            votes[username] = await this.getUserVotes(quizId, username);
        }));
    
        return votes;
    }

    public async getAllScores(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        const questions = await QuizManager.get(quiz.name);
        const answers = questions.map((question) => question.answer);

        const scores = Object
            .entries(await this.getAllVotes(quizId))
            .reduce((prev, [player, votes]) => {
                const score = sum(
                    answers
                        .map((answerIndex, i) => i < votes.length && answerIndex === votes[i])
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

    public async getPlayersWhoVotedUpUntil(quizId: string, questionIndex: number) {
        const votes = await this.getAllVotes(quizId);
        const players = Object.keys(votes);

        return players.filter((player) => votes[player].length >= questionIndex + 1);
    }

    public async getQuestionIndex(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        return quiz.status.questionIndex;
    }

    public async setQuestionIndex(quizId: string, questionIndex: number) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }
        
        await this.setQuiz(quizId, {
            ...quiz,
            status: {
                ...quiz.status,
                questionIndex,
            },
        });
    }

    public async incrementQuestionIndex(quizId: string) {
        const quiz = await this.getQuiz(quizId);

        if (!quiz) {
            throw new InvalidQuizIdError();
        }

        const questionIndex = await this.getQuestionIndex(quizId);

        if (questionIndex + 1 > QuizManager.count(quiz.name)) {
            throw new InvalidQuestionIndexError();
        }

        await this.setQuestionIndex(quizId, questionIndex + 1);
    }

    public async finishQuiz(quizId: string) {
        const quiz = await this.getQuiz(quizId) as Quiz;

        await this.setQuiz(quizId, {
            ...quiz,
            status: {
                ...quiz.status,
                isOver: true,
            },
        });
    }

    public async isTimed(quizId: string) {
        const quiz = await this.getQuiz(quizId) as Quiz;

        return quiz.status.timer.isEnabled;
    }

    public async restartTimer(quizId: string) {
        const quiz = await this.getQuiz(quizId) as Quiz;

        await this.setQuiz(quizId, {
            ...quiz,
            status: {
                ...quiz.status,
                timer: {
                    ...quiz.status.timer,
                    startedAt: new Date(),
                },
            },
        });
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

    protected serializeQuiz(quiz: Quiz) {
        return JSON.stringify({
            ...quiz,
            status: {
                ...quiz.status,
                timer: {
                    ...quiz.status.timer,
                    ...(quiz.status.timer.isEnabled ? {
                        duration: quiz.status.timer.duration!.serialize(),
                        startedAt: quiz.status.timer.startedAt!.toUTCString(),
                    } : {}),
                },
            },
        });
    }

    protected deserializeQuiz(str: string) {
        const quiz = JSON.parse(str);

        return {
            ...quiz,
            status: {
                ...quiz.status,
                timer: {
                    ...quiz.status.timer,
                    ...(quiz.status.timer.isEnabled ? {
                        duration: TimeDuration.deserialize(quiz.status.timer.duration),
                        startedAt: new Date(quiz.status.timer.startedAt),
                    } : {}),
                },
            },
        } as Quiz;
    }
}

export default AppDatabase;