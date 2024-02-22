import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { APP_DB } from '../..';
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



const GetStatusController: RequestHandler = async (req, res, next) => {
    try {
        const { quizId } = await validateParams(req.params);

        return res.json(successResponse(await APP_DB.getQuizStatus(quizId)));

    } catch (err: any) {
        next(err);
    }
}

export default GetStatusController;