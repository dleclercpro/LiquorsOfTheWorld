import { RequestHandler } from 'express';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';

const GetUserController: RequestHandler = async (req, res, next) => {
    try {
        const users = await REDIS_DB.getAll();

        logger.debug(`Users in database:`);

        for (const user in users) {
            logger.debug(`User: ${user}`);
        }
        
        return res.json(successResponse(users));

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

export default GetUserController;