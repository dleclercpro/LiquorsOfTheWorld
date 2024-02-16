import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { QUESTIONS } from '../constants';
import { REDIS_DB } from '..';
import { ParamsDictionary } from 'express-serve-static-core';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId } = params;

    if (quizId === undefined) {
        throw new Error('INVALID_PARAMS');
    }

    const exists = await REDIS_DB.has(`quiz:${quizId}`);
    if (!exists) {
        throw new Error('INVALID_QUIZ_ID');
    }

    return { quizId };
}

const fetchQuestionIndex = async (quizId: string) => {
    const questionIndex = await REDIS_DB.get(`quiz:${quizId}`);

    if (questionIndex === null) {
        throw new Error('INVALID_QUIZ_ID');
    }

    return Number(questionIndex);
}



const GetQuizController: RequestHandler = async (req, res, next) => {
    try {
        const { quizId } = await validateParams(req.params);
        const questionIndex = await fetchQuestionIndex(quizId);

        return res.json(successResponse({
            questions: QUESTIONS,
            questionIndex, // FIXME: set index to zero when creating a game
        }));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizController;