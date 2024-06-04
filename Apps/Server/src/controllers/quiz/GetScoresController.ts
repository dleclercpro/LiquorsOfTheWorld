import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import { APP_DB } from '../..';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import { GroupedScoresData, ScoresData } from '../../types/DataTypes';
import { ADMINS } from '../../config';
import Quiz from '../../models/Quiz';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId } = params;

    if (quizId === undefined) {
        throw new InvalidParamsError();
    }

    const quiz = await Quiz.get(quizId);
    if (!quiz) {
        throw new InvalidQuizIdError();
    }

    return { quiz };
}



const GetScoresController: RequestHandler = async (req, res, next) => {
    try {
        const { quiz } = await validateParams(req.params);

        const scores: ScoresData = await APP_DB.getAllScores(quiz);

        const admins = ADMINS.map((admin) => admin.username);

        return res.json(
            successResponse(
                Object.entries(scores).reduce((prev, [scorer, score]) => {
                    if (admins.includes(scorer)) {
                        return {
                            ...prev,
                            admins: {
                                ...prev.admins,
                                [scorer]: score,
                            },
                        };
                    }

                    return {
                        ...prev,
                        users: {
                            ...prev.users,
                            [scorer]: score,
                        },
                    };
                }, { admins: {}, users: {} } as GroupedScoresData),
            )
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetScoresController;