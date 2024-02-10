import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';

type RequestBody = {
    user: string,
};

const AddPlayerController: RequestHandler = async (req, res, next) => {
    try {
        const { user } = req.body as RequestBody;
        
        logger.trace(`Trying to add user: ${user}`);

        if (await REDIS_DB.has(`user:${user}`)) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        await REDIS_DB.set(`user:${user}`, new Date().toISOString());

        logger.info(`Added user to database: ${user}`);
        
        return res.json(successResponse());

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        // Do not tell client why user can't sign in: just say that
        // their credentials are invalid
        if (err.message === 'USER_ALREADY_EXISTS') {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse('USER_ALREADY_EXISTS'));
        }

        next(err);
    }
}

export default AddPlayerController;