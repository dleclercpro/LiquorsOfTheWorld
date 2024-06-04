import { RequestHandler } from 'express';
import logger from '../../logger';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import UserCannotStartQuizError from '../../errors/UserCannotStartQuizError';
import Quiz from '../../models/Quiz';
import { CallStartQuizRequestData } from '../../types/DataTypes';

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



const StartQuizController: RequestHandler = async (req, res, next) => {
    try {
        const { isSupervised, isTimed, isNextQuestionForced, language } = req.body as CallStartQuizRequestData;
        const { username, isAdmin } = req.user!;

        const { quiz } = await validateParams(req.params);

        // User needs to be admin to start quiz
        if (!isAdmin) {
            throw new UserCannotStartQuizError();
        }

        await quiz.start(isSupervised, isTimed, isNextQuestionForced, language);
        logger.info(`A quiz (ID='${quiz.getId()}') has been started by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default StartQuizController;