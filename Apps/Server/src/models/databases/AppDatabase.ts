import bcrypt from 'bcrypt';
import { N_SALT_ROUNDS } from '../../config';
import { N_QUESTIONS, ANSWERS_EN } from '../../constants';
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
            throw new InvalidQuizIdError();
        }

        await this.setQuiz(quizId, {
            ...quiz,
            players: unique([...quiz.players, username]),
        });
    }

    public async createUser(username: string, password: string, isAdmin: boolean = false) {
        const hashedPassword = await new Promise<string>((resolve, reject) => {
            bcrypt.hash(password, N_SALT_ROUNDS, async (err, hash) => {
                if (err) {
                    logger.fatal(`Cannot hash password of user '${username}'.`, err);
                    reject(new HashError());
                }
      
                resolve(hash);
            });
        });
      
        logger.trace(`Creating ${isAdmin ? 'admin' : 'user'} '${username}'...`);
        const user = { username, isAdmin, hashedPassword };
      
        await this.set(`users:${username}`, this.serializeUser(user));
      
        return user;
    }

    public async createQuiz(quizId: string, username: string) {
        logger.trace(`Creating a new quiz...`);

        if (await this.doesQuizExist(quizId)) {
            throw new QuizAlreadyExistsError();
        }

        const quiz: Quiz = {
            creator: username,
            players: [],
            status: {
                questionIndex: 0,
                isSupervised: false,
                isStarted: false,
                isOver: false,
            },
        };

        await this.set(`quiz:${quizId}`, this.serializeQuiz(quiz));

        return quiz;
    }

    public async startQuiz(quizId: string, isSupervised: boolean) {
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

    public async hasUser(username: string) {
        const user = await this.getUser(username);

        if (user === null) {
            return false;
        }

        return true;
    }

    public async getUser(username: string) {
        const user = await this.get(`users:${username}`);

        if (!user) {
            return;
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
        const votesCount = new Array(N_QUESTIONS).fill(0);

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
        const votes = await this.getAllVotes(quizId);

        const scores = Object.entries(votes)
            .reduce((prev, [username, playerVotes]) => {
                const userScore = sum(
                    ANSWERS_EN
                        .map((answerIndex, i) => i < playerVotes.length && answerIndex === playerVotes[i])
                        .map(Number)
                );
        
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
        const players = Object.keys(votes);

        return players.filter(player => votes[player].length >= questionIndex + 1);
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
        const questionIndex = await this.getQuestionIndex(quizId);
        const quiz = await this.getQuiz(quizId) as Quiz;

        if (questionIndex + 1 === N_QUESTIONS) {
            await this.setQuiz(quizId, {
                ...quiz,
                status: {
                    ...quiz.status,
                    isOver: true,
                },
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

    protected serializeQuiz(quiz: Quiz) {
        return JSON.stringify(quiz);
    }

    protected deserializeQuiz(quiz: string) {
        return JSON.parse(quiz) as Quiz;
    }
}

export default AppDatabase;