import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import UserCannotDeleteQuizError from '../../errors/UserCannotDeleteQuizError copy';

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



const DeleteQuizController: RequestHandler = async (req, res, next) => {
    try {
        const { username, isAdmin } = req.user!;

        const { quizId } = await validateParams(req.params);

        // User needs to be admin to delete quiz
        if (!isAdmin) {
            throw new UserCannotDeleteQuizError();
        }

        await APP_DB.deleteQuiz(quizId);
        logger.info(`Quiz (ID='${quizId}') has been deleted by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default DeleteQuizController;