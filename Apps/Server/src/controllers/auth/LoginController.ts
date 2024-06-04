import { RequestHandler } from 'express';
import { HttpStatusCode } from '../../types/HTTPTypes';
import logger from '../../logger';
import { errorResponse, successResponse } from '../../utils/calls';
import { ADMINS, COOKIE_NAME, COOKIE_OPTIONS, TEAMS, TEAMS_ENABLE } from '../../config';
import { encodeCookie } from '../../utils/cookies';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidPasswordError from '../../errors/InvalidPasswordError';
import UserDoesNotExistError from '../../errors/UserDoesNotExistError';
import QuizAlreadyStartedError from '../../errors/QuizAlreadyStartedError';
import InvalidTeamIdError from '../../errors/InvalidTeamIdError';
import User from '../../models/users/User';
import Quiz from '../../models/Quiz';
import { CallLogInRequestData, CallLogInResponseData } from '../../types/DataTypes';
import { isPasswordValid } from '../../utils/crypto';

const LoginController: RequestHandler = async (req, res, next) => {
    try {
        const { quizName, quizId, teamId, username, password } = req.body as CallLogInRequestData;
        const admin = ADMINS.find(admin => admin.username === username);
        const isAdmin = Boolean(admin);
        logger.trace(`Attempt to join quiz '${quizName}' with ID '${quizId}' as ${isAdmin ? 'admin' : 'user'} '${username}'...`);

        // In case a team is specified, but it doesn't exist
        if (TEAMS_ENABLE && TEAMS) {
            const teamExists = TEAMS.map(({ id }) => id).includes(teamId);
            if (!teamExists) {
                logger.trace(`Team ID '${teamId}' doesn't exist.`);
                throw new InvalidTeamIdError();
            }
        }

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
        let user = await User.get(username);
        if (user) {
            logger.trace(`Validating password for '${username}'...`);

            if (!await isPasswordValid(password, user!.getPassword())) {
                throw new InvalidPasswordError()
            }
        }

        // If neither the quiz, nor the user exist, and they are not an admin:
        // no new user can be created later on
        if (!quiz && !user && !User.isAdmin(username)) {
            throw new UserDoesNotExistError();
        }

        // Now that everything worked out well, create user if it does not
        // already exist
        if (!user) {
            if (isAdmin) {
                user = await User.create({ username, password }, true);
            } else {
                user = await User.create({ username, password }, false);
            }
        }

        // Check if quiz has already started and non-admin user is playing
        const isUserPlaying = quiz.isUserPlaying(user!, teamId);
        if (!isUserPlaying && !user.isAdmin()) {
            logger.debug(`User '${username}' is not part of the quiz.`);
            if (quiz.isStarted()) {
                throw new QuizAlreadyStartedError();
            }

            // Add user to quiz
            await quiz.addUserToPlayers(user!, teamId);
            logger.debug(`User '${username}' joined quiz ${quizId}.`);
        }

        const cookie = await encodeCookie({
            user: { username, isAdmin },
            quizName,
            quizId,
            teamId,
        });

        const response: CallLogInResponseData = {
            username,
            teamId,
            isAdmin,
            isAuthenticated: true,
        };
        
        return res
            .cookie(COOKIE_NAME, cookie, COOKIE_OPTIONS)
            .json(successResponse(response));

    } catch (err: any) {
        if (['USER_ALREADY_EXISTS', 'USER_DOES_NOT_EXIST', 'QUIZ_ALREADY_STARTED', 'INVALID_QUIZ_ID', 'INVALID_TEAM_ID', 'INVALID_PASSWORD'].includes(err.message)) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(err.message));
        }

        next(err);
    }
}

export default LoginController;