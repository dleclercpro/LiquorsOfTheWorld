import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { QUESTIONS } from '../constants';
import { REDIS_DB } from '..';

const GetQuizController: RequestHandler = async (req, res, next) => {
    try {
        const questionIndex = Number(await REDIS_DB.get(`questionIndex`));

        return res.json(successResponse({
            questions: QUESTIONS,
            index: questionIndex, // FIXME: set index to zero when creating a game
        }));

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizController;