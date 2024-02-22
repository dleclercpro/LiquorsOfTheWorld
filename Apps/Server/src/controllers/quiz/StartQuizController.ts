import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { errorResponse, successResponse } from '../../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../../types/HTTPTypes';
import { ParamsDictionary } from 'express-serve-static-core';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId } = params;

    if (quizId === undefined) {
        throw new Error('INVALID_PARAMS');
    }

    if (!await APP_DB.doesQuizExist(quizId)) {
        throw new Error('INVALID_QUIZ_ID');
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
            throw new Error('USER_CANNOT_START_QUIZ');
        }

        await APP_DB.startQuiz(quizId, isSupervised);
        logger.info(`A ${isSupervised ? '' : 'non-'}supervised quiz (ID='${quizId}') has been started by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);

            return res
                .status(HttpStatusCode.NOT_IMPLEMENTED)
                .send(errorResponse(HttpStatusMessage.NOT_IMPLEMENTED));
        }

        next(err);
    }
}

export default StartQuizController;