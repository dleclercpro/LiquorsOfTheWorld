import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { errorResponse, successResponse } from '../../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../../types/HTTPTypes';
import { QuizGame, QuizVote } from '../../types/QuizTypes';
import { ParamsDictionary } from 'express-serve-static-core';
import { QUESTIONS } from '../../constants';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId, questionIndex: _questionIndex } = params;

    if (quizId === undefined || _questionIndex === undefined) {
        throw new Error('INVALID_PARAMS');
    }

    if (!await APP_DB.doesQuizExist(quizId)) {
        throw new Error('INVALID_QUIZ_ID');
    }

    const questionIndex = Number(_questionIndex);
    if (questionIndex + 1 > QUESTIONS.length) {
        throw new Error('INVALID_QUESTION_INDEX');
    }

    return { quizId, questionIndex };
}



type RequestBody = QuizVote;

const VoteController: RequestHandler = async (req, res, next) => {
    try {
        const { vote } = req.body as RequestBody;
        const { username } = req.user!;

        const { quizId, questionIndex } = await validateParams(req.params);

        // Players can only vote on current question index
        const currentQuestionIndex = await APP_DB.getQuestionIndex(quizId);
        if (questionIndex !== currentQuestionIndex) {
            throw new Error('WRONG_QUESTION_INDEX');
        }

        // Get votes from DB if they exist
        let votes = await APP_DB.getUserVotes(quizId, username);

        // Add vote to array, otherwise overwrite it
        if (votes.length === questionIndex) {
            votes = [...votes, vote];
        } else {
            votes[questionIndex] = vote;
        }

        // Store votes in DB
        await APP_DB.setUserVotes(quizId, username, votes);

        // If quiz is not supervised: increment question index
        const quiz = await APP_DB.getQuiz(quizId) as QuizGame;
        if (!quiz.isSupervised) {

            // Find out whether all users have voted up until current question
            const playersWhoVoted = await APP_DB.getPlayersWhoVotedUpUntil(quizId, questionIndex);;
            const players = await APP_DB.getAllPlayers(quizId);
            logger.trace(`Players: ${players}`);
            logger.trace(`Players who voted so far (${playersWhoVoted.length}/${players.length}): ${playersWhoVoted}`);

            // If so: increment quiz's current question index
            if (playersWhoVoted.length === players.length) {
                logger.info(`All users have voted on question #${questionIndex + 1}: incrementing question index...`);
                await APP_DB.incrementQuestionIndex(quizId);
            }
        }

        return res.json(successResponse({
            // FIXME: store quiz status indicators in a 'status' object
            status: await APP_DB.getQuizStatus(quizId),
            votes,
        }));

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