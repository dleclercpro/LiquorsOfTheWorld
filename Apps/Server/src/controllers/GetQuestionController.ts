import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { N_QUIZ_QUESTIONS } from '../config';
import { QUESTIONS } from '../constants';

const GetQuestionController: RequestHandler = async (req, res, next) => {
    try {
        const questionIndex = Number(req.params.questionIndex);

        if (questionIndex + 1 > N_QUIZ_QUESTIONS) {
            throw new Error('INVALID_QUESTION_INDEX');
        }

        const { theme, question, options } = QUESTIONS[questionIndex];

        return res.json(successResponse({ theme, question, options }));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuestionController;