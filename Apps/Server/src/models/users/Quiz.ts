import { randomUUID } from 'crypto';
import { APP_DB } from '../..';
import { TIMER_DURATION } from '../../config';
import { QUIZ_NAMES, QuizName } from '../../constants';
import InvalidQuizNameError from '../../errors/InvalidQuizNameError';
import QuizAlreadyExistsError from '../../errors/QuizAlreadyExistsError';
import logger from '../../logger';
import { StatusData } from '../../types/DataTypes';
import { unique } from '../../utils/array';
import User from './User';
import TimeDuration from '../units/TimeDuration';
import QuizManager from '../QuizManager';
import InvalidQuestionIndexError from '../../errors/InvalidQuestionIndexError';

type QuizArgs = {
    id: string,
    name: QuizName,
    creator: string,
    status: StatusData,
};



class Quiz {
    protected id: string;
    protected name: QuizName;
    protected creator: string;
    protected status: StatusData;

    protected isPopulated: boolean;

    public constructor(args: QuizArgs) {
        this.id = args.id;
        this.name = args.name;
        this.creator = args.creator;
        this.status = args.status;

        this.isPopulated = false;
    }

    public serialize() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            creator: this.creator,
            status: {
                ...this.status,
                timer: {
                    ...this.status.timer,
                    ...(this.status.timer.isEnabled ? {
                        duration: this.status.timer.duration!.serialize(),
                        startedAt: this.status.timer.startedAt!.toUTCString(),
                    } : {}),
                },
            },

            isPopulated: this.isPopulated,
        });
    }

    public static deserialize(str: string) {
        const quiz = JSON.parse(str);

        return new Quiz({
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
        });
    }

    public static async exists(quizId: string) {
        return APP_DB.has(`quiz:${quizId}`);
    }

    public isStarted() {
        return this.status.isStarted;
    }

    public isSupervised() {
        return this.status.isSupervised;
    }

    public isTimed() {
        return this.status.timer.isEnabled;
    }

    public getId() {
        return this.id;
    }

    public getName() {
        return this.name;
    }

    public getStatus() {
        return this.status;
    }

    public getPlayers() {
        return this.status.players;
    }

    public getVotesCount() {
        return this.status.votesCount;
    }

    public static async get(name: string) {
        const quiz = await APP_DB.get(`quiz:${name.toLowerCase()}`);

        if (!quiz) {
            return null;
        }

        return Quiz.deserialize(quiz);
    }

    public static async getAll() {
        const quizzesAsString = await APP_DB.getKeysByPattern(`quiz:*`);

        return quizzesAsString
            .map((quiz) => Quiz.deserialize(quiz));
    }

    public async start(isSupervised: boolean, isTimed: boolean) {
        if (!this.isPopulated) throw new Error('MISSING_QUIZ_DATA');

        this.status.isStarted = true;
        this.status.isSupervised = isSupervised;
        this.status.timer = {
            ...this.status.timer,
            ...(isTimed ? {
                duration: TIMER_DURATION,
                startedAt: new Date(),
            } : {}),
        }

        await this.save();
    }

    public async delete() {
        if (!this.isPopulated) throw new Error('MISSING_QUIZ_DATA');

        // Delete all votes associated with quiz
        await Promise.all(this.status.players.map(async (player) => {
            return APP_DB.delete(`votes:${this.id}:${player}`);
        }));

        // Delete quiz finally
        await APP_DB.delete(`quiz:${this.id}`);
    }

    public async finish() {
        if (!this.isPopulated) throw new Error('MISSING_QUIZ_DATA');

        this.status.isOver = true;

        await this.save();
    }

    public async addUser(user: User, teamId: string = '') {
        if (!this.isPopulated) throw new Error('MISSING_QUIZ_DATA');

        this.status = {
            ...this.status,
            players: unique([...this.status.players, {
                username: user.getUsername().toLowerCase(),
                teamId,
            }]),
        };

        await this.save();
    }

    public async isUserPlaying(user: User, teamId: string = '') {
        return this.status.players
            .filter((player) => player.teamId === teamId)
            .map((player) => player.username.toLowerCase())
            .includes(user.getUsername().toLowerCase());
    }

    public async getQuestionIndex() {
        if (!this.isPopulated) throw new Error('MISSING_QUIZ_DATA');

        return this.status.questionIndex;
    }

    public async setQuestionIndex(questionIndex: number) {
        if (!this.isPopulated) throw new Error('MISSING_QUIZ_DATA');

        this.status.questionIndex = questionIndex;

        await this.save();
    }

    public async incrementQuestionIndex() {
        if (!this.isPopulated) throw new Error('MISSING_QUIZ_DATA');

        const questionIndex = await this.getQuestionIndex();

        if (questionIndex + 1 > QuizManager.count(this.name)) {
            throw new InvalidQuestionIndexError();
        }

        await this.setQuestionIndex(questionIndex + 1);
    }

    public async restartTimer() {
        if (!this.isPopulated) throw new Error('MISSING_QUIZ_DATA');

        this.status.timer.startedAt = new Date();

        await this.save();
    }

    public async save() {
        await APP_DB.set(`quiz:${this.id}`, this.serialize());
    }

    public static async create(quizId: string, quizName: QuizName, username: string) {
        logger.trace(`Creating a new quiz...`);

        if (!QUIZ_NAMES.includes(quizName)) {
            throw new InvalidQuizNameError();
        }

        if (await Quiz.exists(quizId)) {
            throw new QuizAlreadyExistsError();
        }

        const quiz = new Quiz({
            id: quizId,
            name: quizName,
            creator: username.toLowerCase(),
            status: {
                questionIndex: 0,
                isStarted: false,
                isOver: false,
                isSupervised: false,
                players: [],
                votesCount: [],
                timer: {
                    isEnabled: false,
                },
            },
        });

        // Store quiz in DB
        await quiz.save();

        return quiz;
    }

    public static async generateId() {
        let id = '';

        // Generate a new unique ID for the quiz
        while (!id || await Quiz.exists(id)) {
            id = randomUUID();
        }

        return id;
    }
}

export default Quiz;