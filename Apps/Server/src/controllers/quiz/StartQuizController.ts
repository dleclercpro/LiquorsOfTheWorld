import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import UserCannotStartQuizError from '../../errors/UserCannotStartQuizError';

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



type RequestBody = {
    isSupervised: boolean,
};

const StartQuizController: RequestHandler = async (req, res, next) => {
    try {
        const { isSupervised } = req.body as RequestBody;
        const { username, isAdmin } = req.user!;

        const { quizId } = await validateParams(req.params);

        // User needs to be admin to start quiz
        if (!isAdmin) {
            throw new UserCannotStartQuizError();
        }

        await APP_DB.startQuiz(quizId, isSupervised);
        logger.info(`A ${isSupervised ? '' : 'non-'}supervised quiz (ID='${quizId}') has been started by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default StartQuizController;