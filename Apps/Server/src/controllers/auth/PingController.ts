import { RequestHandler } from 'express';
import logger from '../../logger';
import { successResponse } from '../../utils/calls';
import { COOKIE_NAME } from '../../config';
import { decodeCookie } from '../../utils/cookies';

const PingController: RequestHandler = async (req, res, next) => {
    try {
        const cookies = req.cookies;

        // Try to decode JWT cookie to rebuild user object
        const cookie = cookies[COOKIE_NAME] ? decodeCookie(cookies[COOKIE_NAME]) : null;

        return res
            .json(successResponse({
                quizId: cookie ? cookie.quizId : null,
                username: cookie ? cookie.user.username : null,
                isAdmin: cookie ? cookie.user.isAdmin : false,
                isAuthenticated: Boolean(cookie),
            }));

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        next(err);
    }
}

export default PingController;