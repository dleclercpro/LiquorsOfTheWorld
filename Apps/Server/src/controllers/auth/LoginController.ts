import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../types/HTTPTypes';
import logger from '../../logger';
import { errorResponse, successResponse } from '../../utils/calls';
import { Auth } from '../../types';
import { ADMINS, COOKIE_NAME, TEAMS } from '../../config';
import { encodeCookie } from '../../utils/cookies';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidPasswordError from '../../errors/InvalidPasswordError';
import UserDoesNotExistError from '../../errors/UserDoesNotExistError';
import QuizAlreadyStartedError from '../../errors/QuizAlreadyStartedError';
import { QuizName } from '../../constants';
import InvalidTeamIdError from '../../errors/InvalidTeamIdError';
import User from '../../models/users/User';
import Quiz from '../../models/users/Quiz';

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
        let quiz = await Quiz.get(quizId);

        // In case quiz session doesn't exist
        if (!quiz) {
            logger.trace(`Quiz ID '${quizId}' doesn't exist.`);
            if (!isAdmin) { 
                throw new InvalidQuizIdError();
            }

            // Only admins can create new quizzes
            quiz = await Quiz.create(quizId, quizName, username);
        }

        // If user exists: check if password is valid
        const user = await User.get(username);
        if (user) {
            logger.trace(`Validating password for '${username}'...`);
            const user = await User.get(username);

            if (!await isPasswordValid(password, user!.getPassword())) {
                throw new InvalidPasswordError()
            }
        }

        // If neither the quiz, nor the user exist, and they are not an admin:
        // no new user can be created later on
        if (!quiz && !user && !User.isAdmin(username)) {
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
        if (!user) {
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
        const isUserPlaying = await quiz.isUserPlaying(user!, teamId);
        if (!isUserPlaying) {
            if (quiz.isStarted()) {
                throw new QuizAlreadyStartedError();
            }
            await quiz.addUser(user!, teamId);
            logger.trace(`User '${username}' joined quiz ${quizId}.`);
        }

        const cookieUser = { username, isAdmin };
        const cookie = await encodeCookie({
            user: cookieUser,
            quizName,
            quizId,
            teamId,
        });
        
        return res
            .cookie(COOKIE_NAME, cookie)
            .json(successResponse(cookieUser));

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