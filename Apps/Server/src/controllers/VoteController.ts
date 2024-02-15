import { RequestHandler } from 'express';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { QuizVote } from '../types/QuizTypes';
import { getAllUsers, getVotesOfUser } from '../utils/users';
import { SEPARATOR } from '../constants';
import { getAllVotes } from '../utils/scoring';

type RequestBody = QuizVote;

const VoteController: RequestHandler = async (req, res, next) => {
    try {
        const { vote } = req.body as RequestBody;
        const user = req.user!;

        const questionIndex = Number(req.params.questionIndex);

        // Is it the current question index?
        if (questionIndex !== Number(await REDIS_DB.get(`questionIndex`))) {
            throw new Error('INVALID_QUESTION_INDEX');
        }

        // Get votes from DB if they exist
        let votes: number[] = await getVotesOfUser(user.username);

        // Add vote to array, otherwise overwrite it
        if (votes.length === questionIndex) {
            votes = [...votes, vote];
        } else {
            votes[questionIndex] = vote;
        }

        // Store votes in DB
        await REDIS_DB.set(`votes:${user.username}`, votes.join(SEPARATOR));

        // If all users have voted on current question, move on to next one
        // FIXME: create games
        const usersWhoVoted = Object.keys(await getAllVotes());
        const users = await getAllUsers();
        if (usersWhoVoted.length === users.length) {
            logger.info(`All users have voted on question #${questionIndex + 1}: incrementing question index...`);
            await REDIS_DB.set(`questionIndex`, String(questionIndex + 1));
        }

        return res.json(successResponse());

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