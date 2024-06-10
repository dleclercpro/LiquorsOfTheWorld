import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { QUIZ_LABELS, QUIZ_NAMES } from '../../constants';
import { CallGetQuizzesResponseData } from '../../types/DataTypes';

const GetQuizzesController: RequestHandler = async (req, res, next) => {
    try {
        const response: CallGetQuizzesResponseData = QUIZ_NAMES.map((name) => ({
            name,
            label: QUIZ_LABELS[name],
            id: null,
        }));
        
        return res.json(
            successResponse(response)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetQuizzesController;