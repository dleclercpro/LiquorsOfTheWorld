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
        const { username } = req.user!;

        const { quiz } = await validateParams(req.params);

        const votes = await APP_DB.getUserVotes(quiz.getId(), username);

        logger.warn(votes);

        const response: CallGetVotesResponseData = votes;

        return res.json(
            successResponse(response)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetVotesController;