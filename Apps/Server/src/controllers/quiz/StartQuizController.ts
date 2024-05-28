import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import UserCannotStartQuizError from '../../errors/UserCannotStartQuizError';
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



type RequestBody = {
    isSupervised: boolean,
    isTimed: boolean,
};

const StartQuizController: RequestHandler = async (req, res, next) => {
    try {
        const { isSupervised, isTimed } = req.body as RequestBody;
        const { username, isAdmin } = req.user!;

        const { quiz } = await validateParams(req.params);

        // User needs to be admin to start quiz
        if (!isAdmin) {
            throw new UserCannotStartQuizError();
        }

        await quiz.start(isSupervised, isTimed);
        logger.info(`A quiz (ID='${quiz.getId()}') has been started by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default StartQuizController;