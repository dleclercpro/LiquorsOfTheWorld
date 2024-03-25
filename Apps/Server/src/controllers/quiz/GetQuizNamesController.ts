import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { QUIZ_NAMES } from '../../constants';

const GetQuizNamesController: RequestHandler = async (req, res, next) => {
    try {
        return res.json(
            successResponse(QUIZ_NAMES)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizNamesController;