import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import logger from '../logger';

const ReadyController: RequestHandler = async (req, res, next) => {
    try {
        const status = HttpStatusCode.OK;
        
        logger.trace(`Readiness check: ${status}`);
        return res.sendStatus(status);

    } catch (err: any) {
        next(err);
    }
}

export default ReadyController;