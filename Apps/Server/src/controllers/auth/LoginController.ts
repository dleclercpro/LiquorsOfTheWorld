import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../types/HTTPTypes';
import logger from '../../logger';
import { APP_DB } from '../..';
import { errorResponse, successResponse } from '../../utils/calls';
import { Auth } from '../../types';
import { ADMIN, COOKIE_NAME } from '../../config';
import { encodeCookie } from '../../utils/cookies';
import { DatabaseUser } from '../../types/UserTypes';

type RequestBody = Auth & { quizId: string };

const isPasswordValid = async (password: string, hashedPassword: string) => {
    const isValid = await new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, isEqualAfterHash) => {
            if (err) {
                resolve(false);
                return;
            }
  
            if (!isEqualAfterHash) {
                resolve(false);
                return;
            }
  
            resolve(true);
        });
    });
  
    return isValid;
}



const LoginController: RequestHandler = async (req, res, next) => {
    try {
        const { quizId, username, password } = req.body as RequestBody;
        const isAdmin = username === ADMIN;
        logger.trace(`Attempt to join quiz '${quizId}' as ${isAdmin ? 'admin' : 'user'} '${username}'...`);

        // If user exists: check if password is valid
        const userExists = await APP_DB.doesUserExist(username);
        if (userExists) {
            logger.trace(`Validating password for '${username}'...`);
            const user = JSON.parse(await APP_DB.getUser(username) as string) as DatabaseUser;

            if (!await isPasswordValid(password, user.hashedPassword)) {
                throw new Error('INVALID_PASSWORD');
            }
        }

        // In case quiz doesn't exist
        let quiz = await APP_DB.getQuiz(quizId);
        if (!quiz) {
            if (!isAdmin) {
                throw new Error('INVALID_QUIZ_ID');
            }
            quiz = await APP_DB.createQuiz(quizId, username);
        }

        // Check if quiz has already started and user is playing
        const isPlaying = await APP_DB.isUserPlaying(quizId, username);
        if (!isPlaying) {
            if (quiz.hasStarted) {
                throw new Error('USER_NOT_PART_OF_QUIZ');
            }
            await APP_DB.addUserToQuiz(quizId, username);
        }

        // If user didn't exist, create them, now that everything worked out well
        if (!userExists) {
            logger.trace(`Creating user '${username}'...`);
            await APP_DB.createUser(username, password);
        }

        logger.trace(`User '${username}' joined quiz ${quizId}.`);
        const user = { username, isAdmin };
        const cookie = await encodeCookie({ user, quizId });
        
        return res
            .cookie(COOKIE_NAME, cookie)
            .json(successResponse(user));

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

        if (['INVALID_QUIZ_ID', 'USER_NOT_PART_OF_QUIZ'].includes(err.message)) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(err.message));
        }

        next(err);
    }
}

export default LoginController;