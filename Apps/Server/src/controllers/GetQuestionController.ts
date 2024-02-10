import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import quiz from '../../data/quiz.json';
import { N_QUIZ_QUESTIONS } from '../config';

const GetQuestionController: RequestHandler = async (req, res, next) => {
    try {
        const questionId = Number(req.params.questionId);

        if (questionId + 1 > N_QUIZ_QUESTIONS) {
            throw new Error('INVALID_QUESTION_INDEX');
        }

        const { theme, question, options } = quiz[questionId];

        return res.json(successResponse({ theme, question, options }));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuestionController;