import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import { APP_DB } from '../..';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import { GroupedScoreData, ScoreData } from '../../types/DataTypes';
import { ADMINS } from '../../config';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId } = params;

    if (quizId === undefined) {
        throw new InvalidParamsError();
    }

    if (!await APP_DB.doesQuizExist(quizId)) {
        throw new InvalidQuizIdError();
    }

    return { quizId };
}



const GetScoresController: RequestHandler = async (req, res, next) => {
    try {
        const { quizId } = await validateParams(req.params);

        const scores: ScoreData = await APP_DB.getAllScores(quizId);

        const admins = ADMINS.map((admin) => admin.username);

        return res.json(
            successResponse(
                Object.entries(scores).reduce((prev, [player, score]) => {
                    if (admins.includes(player)) {
                        return {
                            ...prev,
                            admins: {
                                ...prev.admins,
                                [player]: score,
                            },
                        };
                    }

                    return {
                        ...prev,
                        users: {
                            ...prev.users,
                            [player]: score,
                        },
                    };
                }, { admins: {}, users: {} } as GroupedScoreData),
            )
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetScoresController;