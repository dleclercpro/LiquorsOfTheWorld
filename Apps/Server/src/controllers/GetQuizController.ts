import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import QUIZ from '../../data/quiz.json';

const GetQuizController: RequestHandler = async (req, res, next) => {
    try {
        return res.json(successResponse(QUIZ));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizController;