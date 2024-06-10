import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import { APP_DB } from '../..';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import { GroupedScoresData, ScoresData } from '../../types/DataTypes';
import { ADMINS } from '../../config';
import Quiz from '../../models/Quiz';
import { UserType } from '../../constants';
import User from '../../models/users/User';
import logger from '../../logger';

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

        logger.trace(`Reading all scores of quiz: ID = ${quiz.getId()}`);

        const response: GroupedScoresData = await APP_DB.getAllScores(quiz);

        return res.json(successResponse(response));

    } catch (err: any) {
        next(err);
    }
}

export default GetScoresController;