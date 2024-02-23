import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { successResponse } from '../../utils/calls';
import { QuizGame, QuizVote } from '../../types/QuizTypes';
import { ParamsDictionary } from 'express-serve-static-core';
import { N_QUESTIONS } from '../../constants';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import InvalidQuestionIndexError from '../../errors/InvalidQuestionIndexError';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId, questionIndex: _questionIndex } = params;

    if (quizId === undefined || _questionIndex === undefined) {
        throw new InvalidParamsError();
    }

    if (!await APP_DB.doesQuizExist(quizId)) {
        throw new InvalidQuizIdError();
    }

    const questionIndex = Number(_questionIndex);
    if (questionIndex + 1 > N_QUESTIONS) {
        throw new InvalidQuestionIndexError();
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
            throw new InvalidQuestionIndexError();
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
        next(err);
    }
}

export default VoteController;