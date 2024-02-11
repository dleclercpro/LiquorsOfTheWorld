import { RequestHandler } from 'express';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { QuizVote } from '../types/QuizTypes';
import { COOKIE_NAME } from '../config';
import { encodeCookie } from '../utils/cookies';
import { getUserVotes } from '../utils/users';
import { SEPARATOR } from '../constants';

type RequestBody = QuizVote;

const VoteController: RequestHandler = async (req, res, next) => {
    try {
        const { vote } = req.body as RequestBody;
        const user = req.user!;

        const questionIndex = Number(req.params.questionIndex);
        const nextQuestionIndex = questionIndex + 1;

        // Get votes from DB if they exist
        let votes: number[] = [] = await getUserVotes(user.username);

        // Add vote to array
        if (votes.length === questionIndex) {
            votes = [...votes, vote];
        }
        // Overwrite vote
        else {
            votes[questionIndex] = vote;
        }

        // Re-write the user object
        const newUser = {
            ...user,
            questionIndex: nextQuestionIndex,
        };

        // Store votes in DB
        await REDIS_DB.set(`votes:${user.username}`, votes.join(SEPARATOR));

        // Update current question index for user in DB
        await REDIS_DB.set(`users:${user.username}`, JSON.stringify(newUser));

        // Update user cookie
        return res
            .cookie(COOKIE_NAME, await encodeCookie(newUser))
            .json(successResponse());

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);

            return res
                .status(HttpStatusCode.NOT_IMPLEMENTED)
                .send(errorResponse(HttpStatusMessage.NOT_IMPLEMENTED));
        }

        next(err);
    }
}

export default VoteController;