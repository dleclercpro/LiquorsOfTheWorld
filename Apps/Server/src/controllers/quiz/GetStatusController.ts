import { RequestHandler } from 'express';
import { errorResponse, successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidParamsError from '../../errors/InvalidParamsError';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import Quiz from '../../models/Quiz';
import { CallGetStatusResponseData } from '../../types/DataTypes';
import { HttpStatusCode } from '../../types/HTTPTypes';

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

        const response: CallGetStatusResponseData = quiz.getStatus();

        return res.json(
            successResponse(response)
        );

    } catch (err: any) {
        if (['INVALID_QUIZ_ID'].includes(err.message)) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(err.message));
        }

        next(err);
    }
}

export default GetStatusController;