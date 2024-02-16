import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { N_QUIZ_QUESTIONS } from '../config';
import { QUESTIONS } from '../constants';
import { ParamsDictionary } from 'express-serve-static-core';

const validateParams = (params: ParamsDictionary) => {
    const { questionIndex: _questionIndex } = params;

    if (_questionIndex === undefined) {
        throw new Error('INVALID_PARAMS');
    }

    const questionIndex = Number(_questionIndex);

    if (questionIndex + 1 > N_QUIZ_QUESTIONS) {
        throw new Error('INVALID_QUESTION_INDEX');
    }

    return { questionIndex };
}



const GetQuestionController: RequestHandler = async (req, res, next) => {
    try {
        const { questionIndex } = validateParams(req.params);

        return res.json(successResponse(QUESTIONS[questionIndex]));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuestionController;