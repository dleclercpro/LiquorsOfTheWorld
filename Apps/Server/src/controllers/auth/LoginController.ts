import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../types/HTTPTypes';
import logger from '../../logger';
import { APP_DB } from '../..';
import { errorResponse, successResponse } from '../../utils/calls';
import { Auth } from '../../types';
import { ADMINS, COOKIE_NAME } from '../../config';
import { encodeCookie } from '../../utils/cookies';
import { DatabaseUser } from '../../types/UserTypes';

type RequestBody = Auth & {
    quizId: string,
};

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
        const isAdmin = ADMINS.includes(username);
        logger.trace(`Attempt to join quiz '${quizId}' as ${isAdmin ? 'admin' : 'user'} '${username}'...`);

        // Check if quiz exists
        let quiz = await APP_DB.getQuiz(quizId);
        const quizExists = Boolean(quiz);
        const hasQuizStarted = quiz?.hasStarted;

        // In case quiz doesn't exist
        if (!quizExists) {
            if (!isAdmin) { 
                throw new Error('INVALID_QUIZ_ID');
            }

            // Only admins can create new quizzes
            quiz = await APP_DB.createQuiz(quizId, username);
        }

        // If user exists: check if password is valid
        const userExists = await APP_DB.doesUserExist(username);
        if (userExists) {
            logger.trace(`Validating password for '${username}'...`);
            const user = await APP_DB.getUser(username) as DatabaseUser;

            if (!await isPasswordValid(password, user.hashedPassword)) {
                throw new Error('INVALID_PASSWORD');
            }
        }

        // If neither the quiz, nor the user exist, and they are not an admin:
        // no new user can be created later on
        if (!quizExists && !userExists && !isAdmin) {
            throw new Error('USER_DOES_NOT_EXIST');
        }

        // Now that everything worked out well, create user if it does not
        // already exist
        if (!userExists) {
            logger.trace(`Creating user '${username}'...`);
            await APP_DB.createUser(username, password);
        }

        // Check if quiz has already started and user is playing
        const isPlaying = await APP_DB.isUserPlaying(quizId, username);
        if (!isPlaying) {
            if (hasQuizStarted) {
                throw new Error('QUIZ_ALREADY_STARTED');
            }
            await APP_DB.addUserToQuiz(quizId, username);
            logger.trace(`User '${username}' joined quiz ${quizId}.`);
        }

        const user = { username, isAdmin };
        const cookie = await encodeCookie({ user, quizId });
        
        return res
            .cookie(COOKIE_NAME, cookie)
            .json(successResponse(user));

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        if (['USER_ALREADY_EXISTS', 'USER_DOES_NOT_EXIST', 'QUIZ_ALREADY_STARTED', 'INVALID_QUIZ_ID', 'INVALID_PASSWORD'].includes(err.message)) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(err.message));
        }

        next(err);
    }
}

export default LoginController;