import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import logger from '../logger';

const HealthController: RequestHandler = async (req, res, next) => {
    try {
        const status = HttpStatusCode.OK;
        
        logger.trace(`Health check: ${status}`);
        return res.sendStatus(status);

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        next(err);
    }
}

export default HealthController;