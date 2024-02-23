import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import { APP_DB } from '../..';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';

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



const GetVotesController: RequestHandler = async (req, res, next) => {
    try {
        const { username } = req.user!;

        const { quizId } = await validateParams(req.params);

        const votes = await APP_DB.getUserVotes(quizId, username);

        return res.json(successResponse(votes));

    } catch (err: any) {
        next(err);
    }
}

export default GetVotesController;