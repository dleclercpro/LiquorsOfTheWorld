import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../types/HTTPTypes';
import logger from '../../logger';
import { APP_DB } from '../..';
import { errorResponse, successResponse } from '../../utils/calls';
import { Auth } from '../../types';
import { COOKIE_NAME } from '../../config';
import { encodeCookie } from '../../utils/cookies';
import { isPasswordValid } from '../../utils/math';
import { DatabaseUser } from '../../types/UserTypes';

type RequestBody = Auth & { quizId: string };

const LoginController: RequestHandler = async (req, res, next) => {
    try {
        const { quizId, username, password } = req.body as RequestBody;
        logger.trace(`Attempt to join quiz '${quizId}' as '${username}'...`);

        if (!await APP_DB.doesQuizExist(quizId)) {
            throw new Error('INVALID_QUIZ_ID');
        }

        // TODO: check if quiz has already started

        if (await APP_DB.doesUserExist(username)) {
            logger.trace(`Validating password for '${username}'...`);
            const user = JSON.parse(await APP_DB.getUser(username) as string) as DatabaseUser;

            const isAuthorized = await isPasswordValid(password, user.hashedPassword);
            if (!isAuthorized) {
                logger.warn(`Failed joining attempt for '${username}'.`);
                throw new Error('INVALID_PASSWORD');
            }
        } else {
            logger.trace(`Creating user '${username}'...`);
            await APP_DB.createUser(username, password);
        }

        // TODO: check if user is part of quiz

        logger.trace(`User '${username}' joined quiz ${quizId}.`);
        const cookie = await encodeCookie({
            user: { username },
            quizId,
        });
        
        return res
            .cookie(COOKIE_NAME, cookie)
            .json(successResponse());

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

        if (['INVALID_QUIZ_ID'].includes(err.message)) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse('INVALID_QUIZ_ID'));
        }

        next(err);
    }
}

export default LoginController;