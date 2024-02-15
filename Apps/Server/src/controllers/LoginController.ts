import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';
import { Auth } from '../types';
import { COOKIE_NAME } from '../config';
import { encodeCookie } from '../utils/cookies';
import { isPasswordValid } from '../utils/math';
import { createUser } from '../utils/users';
import { DatabaseUser, User } from '../types/UserTypes';
import { DEFAULT_USER } from '../constants';

type RequestBody = Auth;

const LoginController: RequestHandler = async (req, res, next) => {
    try {
        const { username, password } = req.body as RequestBody;
        logger.trace(`Login attempt for: ${username}`);

        let user: DatabaseUser = DEFAULT_USER;

        if (await REDIS_DB.has(`users:${username}`)) {
            logger.trace(`User exists: validating password...`);

            user = JSON.parse(await REDIS_DB.get(`users:${username}`) as string) as DatabaseUser;
            
            const isAuthorized = await isPasswordValid(password, user.hashedPassword);

            if (!isAuthorized) {
                logger.warn(`Failed login attempt for: ${username}`);
                throw new Error('INVALID_PASSWORD');
            }
        } else {
            user = await createUser(username, password);
        }

        const cookie = await encodeCookie(user);
        
        return res
            .cookie(COOKIE_NAME, cookie)
            .json(successResponse<User>({
                username: user.username,
            }));

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        // Do not tell client why user can't sign in: just say that
        // their credentials are invalid
        if (['USER_ALREADY_EXISTS', 'INVALID_PASSWORD'].includes(err.message)) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse('INVALID_CREDENTIALS'));
        }

        next(err);
    }
}

export default LoginController;