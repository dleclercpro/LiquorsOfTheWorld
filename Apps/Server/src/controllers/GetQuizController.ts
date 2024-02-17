import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { QUESTIONS } from '../constants';

const GetQuizController: RequestHandler = async (req, res, next) => {
    try {
        return res.json(successResponse({
            questions: QUESTIONS,
        }));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizController;