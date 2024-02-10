import { RequestHandler } from 'express';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { QuizVote } from '../types/QuizTypes';

const SEPARATOR = '|';

type RequestBody = QuizVote;

const VoteController: RequestHandler = async (req, res, next) => {
    try {
        const { vote } = req.body as RequestBody;
        const { username } = req.user!;
        const questionId = Number(req.params.questionId);

        let votes: number[] = [];

        // Get votes from DB if they exist
        if (await REDIS_DB.has(`votes:${username}`)) {
            votes = (await REDIS_DB.get(`votes:${username}`))!
                .split(SEPARATOR)
                .map(Number);
        }

        logger.debug(`'${username}' voted on question #${questionId} for: ${vote}`);

        if (votes.length === questionId) {
            votes = [...votes, vote];
        } else {
            votes[questionId] = vote;
        }

        logger.debug(`Votes of '${username}' so far: ${votes}`);

        // Store votes in DB
        await REDIS_DB.set(`votes:${username}`, votes.join(SEPARATOR))

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