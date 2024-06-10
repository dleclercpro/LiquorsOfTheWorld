import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import { APP_DB } from '../..';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import Quiz from '../../models/Quiz';
import { CallGetVotesResponseData } from '../../types/DataTypes';
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



const GetVotesController: RequestHandler = async (req, res, next) => {
    try {
        const { quiz } = await validateParams(req.params);

        logger.trace(`Reading all votes of quiz: ID = ${quiz.getId()}`);

        const response: CallGetVotesResponseData = await APP_DB.getAllVotes(quiz);

        return res.json(
            successResponse(response)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetVotesController;