import { RequestHandler } from 'express';
import logger from '../logger';
import { successResponse } from '../utils/calls';
import { COOKIE_NAME } from '../config';



const LogoutController: RequestHandler = async (req, res, next) => {
    const { username } = req.user!;
    
    try {
        logger.trace(`Logging '${username}' out...`);

        return res
            .clearCookie(COOKIE_NAME)
            .json(successResponse());

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        next(err);
    }
}

export default LogoutController;