import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import { APP_DB } from '../..';

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



const GetScoresController: RequestHandler = async (req, res, next) => {
    try {
        const { quizId } = await validateParams(req.params);

        const scores = await APP_DB.getAllScores(quizId);

        return res.json(successResponse(scores));

    } catch (err: any) {
        next(err);
    }
}

export default GetScoresController;