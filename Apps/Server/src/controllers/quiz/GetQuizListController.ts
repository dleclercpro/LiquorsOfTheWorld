import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { QUIZ_LABELS, QUIZ_NAMES } from '../../constants';
import { CallGetQuizListResponseData } from '../../types/DataTypes';

const GetQuizListController: RequestHandler = async (req, res, next) => {
    try {
        const response: CallGetQuizListResponseData = QUIZ_NAMES.map((name) => ({
            name,
            label: QUIZ_LABELS[name],
        }));

        return res.json(
            successResponse(response)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizListController;