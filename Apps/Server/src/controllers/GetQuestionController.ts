import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import quiz from '../../data/quiz.json';
import logger from '../logger';
import { N_QUIZ_QUESTIONS } from '../config';

const GetQuestionController: RequestHandler = async (req, res, next) => {
    try {
        const questionId = Number(req.params.questionId);

        if (questionId + 1 > N_QUIZ_QUESTIONS) {
            throw new Error('INVALID_QUESTION_INDEX');
        } else {
            logger.trace(`Question ID is valid: ${questionId + 1}/${N_QUIZ_QUESTIONS}`);
        }

        const { theme, question } = quiz[questionId];

        logger.debug(`Trying to read quiz question ${questionId + 1}/${quiz.length}...`);
        return res.json(successResponse({ theme, question, }));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuestionController;