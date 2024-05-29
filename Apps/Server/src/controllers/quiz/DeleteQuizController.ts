import { RequestHandler } from 'express';
import logger from '../../logger';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import UserCannotDeleteQuizError from '../../errors/UserCannotDeleteQuizError';
import Quiz from '../../models/Quiz';

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



const DeleteQuizController: RequestHandler = async (req, res, next) => {
    try {
        const { username, isAdmin } = req.user!;

        const { quiz } = await validateParams(req.params);

        // User needs to be admin to delete quiz
        if (!isAdmin) {
            throw new UserCannotDeleteQuizError();
        }

        await quiz.delete();
        logger.info(`Quiz (ID='${quiz.getId()}') has been deleted by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default DeleteQuizController;