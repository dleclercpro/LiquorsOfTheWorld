import { RequestHandler } from 'express';
import logger from '../../logger';
import { successResponse } from '../../utils/calls';
import { COOKIE_NAME, COOKIE_OPTIONS } from '../../config';

const LogoutController: RequestHandler = async (req, res, next) => {
    const { username } = req.user!;
    
    try {
        logger.trace(`Logging '${username}' out...`);

        return res
            .clearCookie(COOKIE_NAME, COOKIE_OPTIONS)
            .json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default LogoutController;