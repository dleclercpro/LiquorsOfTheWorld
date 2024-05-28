import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { APP_DB } from '../..';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidParamsError from '../../errors/InvalidParamsError';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
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



const GetStatusController: RequestHandler = async (req, res, next) => {
    try {
        const { quiz } = await validateParams(req.params);

        return res.json(
            successResponse(quiz.getStatus())
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetStatusController;