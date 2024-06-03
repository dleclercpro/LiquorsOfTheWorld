import { randomUUID } from 'crypto';
import { APP_DB } from '..';
import { Language, NON_VOTE, QUIZ_NAMES, QuizName } from '../constants';
import InvalidQuizNameError from '../errors/InvalidQuizNameError';
import QuizAlreadyExistsError from '../errors/QuizAlreadyExistsError';
import logger from '../logger';
import { getRange, unique } from '../utils/array';
import User from './users/User';
import QuizManager from './QuizManager';
import InvalidQuestionIndexError from '../errors/InvalidQuestionIndexError';
import { PlayerData, TimerData } from '../types/DataTypes';
import { TIMER_DURATION } from '../config';

type QuizArgs = {
    id: string,
    name: QuizName,
    language?: Language,
    creator: string,
    status: QuizStatusArgs,
    players: PlayerData[],
};

type QuizStatusArgs = {
    isStarted: boolean,
    isOver: boolean,
    isSupervised: boolean,
    isNextQuestionForced: boolean,
    questionIndex: number,
    voteCounts: number[],
    timer: TimerData,
  }



class Quiz {
    protected id: string;
    protected name: QuizName;
    protected language: Language;
    protected creator: string;
    protected players: PlayerData[];
    protected status: QuizStatusArgs;

    public constructor(args: QuizArgs) {
        this.id = args.id;
        this.name = args.name;
        this.language = args.language ?? Language.EN;
        this.creator = args.creator;
        this.players = args.players ?? [];
        this.status = args.status;
    }

    public serialize() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            language: this.language,
            creator: this.creator,
            players: this.players,
            status: {
                ...this.status,
                timer: {
                    ...this.status.timer,
                    ...(this.status.timer.isEnabled ? {
                        startedAt: this.status.timer.startedAt!.toUTCString(),
                    } : {}),
                },
            },
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

    public isNextQuestionForced() {
        return this.status.isNextQuestionForced;
    }

    public getId() {
        return this.id;
    }

    public getName() {
        return this.name;
    }

    public getLanguage() {
        return this.language;
    }

    public getStatus() {
        return this.status;
    }

    public getPlayers() {
        return this.players;
    }

    public async updateVoteCounts() {
        const questionCount = await QuizManager.count(this.name);
        const voteCounts = new Array(questionCount).fill(0);

        const votes = await APP_DB.getAllVotes(this.id);
        const players = Object.keys(votes);

        // For each player, every vote that is not equal to -1 is a
        // valid vote
        players.forEach((player) => {
            getRange(questionCount).forEach((i) => {
                if (votes[player][i] !== NON_VOTE) {
                    voteCounts[i] += 1;
                }
            });
        });

        this.status.voteCounts = voteCounts;

        await this.save();
    }

    public getVoteCounts() {
        return this.status.voteCounts;
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

    public async delete() {

        // Delete all votes associated with quiz
        await Promise.all(this.players.map(async (player) => {
            return APP_DB.delete(`votes:${this.id}:${player}`);
        }));

        // Delete quiz finally
        await APP_DB.delete(`quiz:${this.id}`);
    }

    public async start(isSupervised: boolean, isTimed: boolean, isNextQuestionForced: boolean, language: Language) {
        this.language = language;

        this.status.isStarted = true;
        this.status.isSupervised = isSupervised;
        this.status.isNextQuestionForced = isNextQuestionForced;

        // Create a timer
        this.status.timer = isTimed ? {
            isEnabled: true,
            startedAt: new Date(),
            duration:  {
                amount: TIMER_DURATION.getAmount(),
                unit: TIMER_DURATION.getUnit(),
            },
        } : {
            isEnabled: false,
        };

        await this.save();
    }

    public async finish() {
        this.status.isOver = true;

        await this.save();
    }

    public async addUser(user: User, teamId: string = '') {
        this.players = unique([...this.players, {
            username: user.getUsername().toLowerCase(),
            teamId,
        }]);

        const questionCount = await QuizManager.count(this.name);

        await APP_DB.setUserVotes(this.id, user.getUsername(), new Array(questionCount).fill(NON_VOTE));

        await this.save();
    }

    public isUserPlaying(user: User, teamId: string = '') {
        return this.players
            .filter((player) => player.teamId === teamId)
            .map((player) => player.username.toLowerCase())
            .includes(user.getUsername().toLowerCase());
    }

    public getQuestionIndex() {
        return this.status.questionIndex;
    }

    public async setQuestionIndex(questionIndex: number) {
        this.status.questionIndex = questionIndex;

        await this.save();
    }

    public async incrementQuestionIndex() {
        const questionIndex = this.getQuestionIndex();
        const questionCount = await QuizManager.count(this.name);

        if (questionIndex + 1 > questionCount) {
            throw new InvalidQuestionIndexError();
        }

        await this.setQuestionIndex(questionIndex + 1);
    }

    public async restartTimer() {
        this.status.timer.startedAt = new Date();

        await this.save();
    }

    public async save() {
        await APP_DB.set(`quiz:${this.id}`, this.serialize());
    }

    public static async create(id: string, name: QuizName, username: string, teamId: string = '') {
        logger.info(`Creating a new quiz '${name}' (ID = ${id})...`);

        if (!QUIZ_NAMES.includes(name)) {
            throw new InvalidQuizNameError();
        }

        if (await Quiz.exists(id)) {
            throw new QuizAlreadyExistsError();
        }

        const quiz = new Quiz({
            id,
            name,
            creator: username.toLowerCase(),
            players: [],
            status: {
                isStarted: false,
                isOver: false,
                isSupervised: false,
                isNextQuestionForced: false,
                questionIndex: 0,
                voteCounts: new Array(await QuizManager.count(name)).fill(0),
                timer: {
                    isEnabled: false,
                },
            },
        });

        // Add creator game to players
        const user = await User.get(username);
        if (user) {
            await quiz.addUser(user, teamId);
        }

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