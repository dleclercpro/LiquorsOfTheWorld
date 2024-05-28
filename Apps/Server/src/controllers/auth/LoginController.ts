import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../types/HTTPTypes';
import logger from '../../logger';
import { APP_DB } from '../..';
import { errorResponse, successResponse } from '../../utils/calls';
import { Auth } from '../../types';
import { ADMINS, COOKIE_NAME, TEAMS } from '../../config';
import { encodeCookie } from '../../utils/cookies';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidPasswordError from '../../errors/InvalidPasswordError';
import UserDoesNotExistError from '../../errors/UserDoesNotExistError';
import QuizAlreadyStartedError from '../../errors/QuizAlreadyStartedError';
import { Quiz } from '../../types/QuizTypes';
import { QuizName } from '../../constants';
import InvalidTeamIdError from '../../errors/InvalidTeamIdError';
import User from '../../models/users/User';

type RequestBody = Auth & {
    quizName: QuizName,
    quizId: string,
    teamId: string,
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
        const { quizName, quizId, teamId, username, password } = req.body as RequestBody;
        const admin = ADMINS.find(admin => admin.username === username);
        const isAdmin = Boolean(admin);
        logger.trace(`Attempt to join quiz '${quizName}' with ID '${quizId}' as ${isAdmin ? 'admin' : 'user'} '${username}'...`);

        // Check if quiz exists
        let quiz = await APP_DB.getQuiz(quizId);
        const quizExists = Boolean(quiz);

        // In case quiz session doesn't exist
        if (!quizExists) {
            logger.trace(`Quiz ID '${quizId}' doesn't exist.`);
            if (!isAdmin) { 
                throw new InvalidQuizIdError();
            }

            // Only admins can create new quizzes
            quiz = await APP_DB.createQuiz(quizId, quizName, username);
        }

        const isQuizStarted = (quiz as Quiz).status.isStarted;

        // If user exists: check if password is valid
        const userExists = await User.get(username);
        if (userExists) {
            logger.trace(`Validating password for '${username}'...`);
            const user = await User.get(username);

            if (!await isPasswordValid(password, user!.getPassword())) {
                throw new InvalidPasswordError()
            }
        }

        // If neither the quiz, nor the user exist, and they are not an admin:
        // no new user can be created later on
        if (!quizExists && !userExists && !isAdmin) {
            throw new UserDoesNotExistError();
        }

        // In case a team is specified, but it doesn't exist
        if (TEAMS) {
            const teamExists = TEAMS.map(({ id }) => id).includes(teamId);
            if (!teamExists) {
                logger.trace(`Team ID '${teamId}' doesn't exist.`);
                throw new InvalidTeamIdError();
            }
        }

        // Now that everything worked out well, create user if it does not
        // already exist
        if (!userExists) {
            if (isAdmin) {
                logger.trace(`Creating admin '${username}'...`);
                if (password !== admin!.password) {
                    throw new InvalidPasswordError();
                }
                await User.create({ username, password }, true);
            } else {
                logger.trace(`Creating user '${username}'...`);
                await User.create({ username, password }, false);
            }
        }

        // Check if quiz has already started and user is playing
        const isUserPlaying = await APP_DB.isUserPlaying(quizId, username);
        if (!isUserPlaying) {
            if (isQuizStarted) {
                throw new QuizAlreadyStartedError();
            }
            await APP_DB.addUserToQuiz(quizId, username);
            logger.trace(`User '${username}' joined quiz ${quizId}.`);
        }

        const user = { username, isAdmin };
        const cookie = await encodeCookie({ user, quizName, quizId });
        
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