import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import quiz from '../../data/quiz.json';
import logger from '../logger';

const GetQuizController: RequestHandler = async (req, res, next) => {
    try {
        logger.debug(`Trying to read quiz...`);

        return res.json(successResponse(quiz.map(({ theme, question }) => ({ theme, question, }), {})));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizController;