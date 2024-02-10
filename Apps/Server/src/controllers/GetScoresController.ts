import { RequestHandler } from 'express';
import logger from '../logger';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { computeScores } from '../utils/scoring';

const GetScoresController: RequestHandler = async (req, res, next) => {
    try {
        const scores = await computeScores();

        return res.json(successResponse(scores));

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);

            return res
                .status(HttpStatusCode.NOT_IMPLEMENTED)
                .send(errorResponse(HttpStatusMessage.NOT_IMPLEMENTED));
        }

        next(err);
    }
}

export default GetScoresController;