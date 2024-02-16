import { RequestHandler } from 'express';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { QuizVote } from '../types/QuizTypes';
import { getAllUsers, getVotesOfUser } from '../utils/users';
import { SEPARATOR } from '../constants';
import { getAllVotes } from '../utils/scoring';
import { ParamsDictionary } from 'express-serve-static-core';
import { N_QUIZ_QUESTIONS } from '../config';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId, questionIndex: _questionIndex } = params;

    if (quizId === undefined || _questionIndex === undefined) {
        throw new Error('INVALID_PARAMS');
    }

    const exists = await REDIS_DB.has(`quiz:${quizId}`);
    if (!exists) {
        throw new Error('INVALID_QUIZ_ID');
    }

    const _currentQuestionIndex = await REDIS_DB.get(`quiz:${quizId}`);
    if (_currentQuestionIndex === null) {
        throw new Error('INVALID_QUIZ_ID');
    }

    const questionIndex = Number(_questionIndex);
    if (questionIndex + 1 > N_QUIZ_QUESTIONS) {
        throw new Error('INVALID_QUESTION_INDEX');
    }

    // Is it the current question index?
    const currentQuestionIndex = Number(_currentQuestionIndex);
    if (questionIndex !== currentQuestionIndex) {
        throw new Error('WRONG_QUESTION_INDEX');
    }

    return { quizId, questionIndex };
}



type RequestBody = QuizVote;

const VoteController: RequestHandler = async (req, res, next) => {
    try {
        const { vote } = req.body as RequestBody;
        const { username } = req.user!;

        const { quizId, questionIndex } = await validateParams(req.params);

        // Get votes from DB if they exist
        let votes = await getVotesOfUser(quizId, username);

        // Add vote to array, otherwise overwrite it
        if (votes.length === questionIndex) {
            votes = [...votes, vote];
        } else {
            votes[questionIndex] = vote;
        }

        // Store votes in DB
        await REDIS_DB.set(`votes:${quizId}:${username}`, votes.join(SEPARATOR));

        // If all users have voted on current question, move on to next one
        const usersWhoVoted = Object.keys(await getAllVotes(quizId));
        const users = await getAllUsers();
        if (usersWhoVoted.length === users.length) {
            logger.info(`All users have voted on question #${questionIndex + 1}: incrementing question index...`);
            await REDIS_DB.set(`quiz:${quizId}`, String(questionIndex + 1));
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