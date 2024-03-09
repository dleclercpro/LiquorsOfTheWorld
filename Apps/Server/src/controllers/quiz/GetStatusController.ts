import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { APP_DB } from '../..';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidParamsError from '../../errors/InvalidParamsError';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';

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



const GetStatusController: RequestHandler = async (req, res, next) => {
    try {
        const { quizId } = await validateParams(req.params);

        return res.json(
            successResponse(
                await APP_DB.getQuizStatus(quizId)
            )
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetStatusController;