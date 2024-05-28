import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import { APP_DB } from '../..';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import Quiz from '../../models/users/Quiz';

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

        return res.json(successResponse(votes));

    } catch (err: any) {
        next(err);
    }
}

export default GetVotesController;