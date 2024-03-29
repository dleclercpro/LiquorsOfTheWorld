import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { successResponse } from '../../utils/calls';
import { Quiz, Vote } from '../../types/QuizTypes';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import InvalidQuestionIndexError from '../../errors/InvalidQuestionIndexError';
import QuizManager from '../../models/QuizManager';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId, questionIndex: _questionIndex } = params;

    if (quizId === undefined || _questionIndex === undefined) {
        throw new InvalidParamsError();
    }

    const quiz = await APP_DB.getQuiz(quizId);
    if (!quiz) {
        throw new InvalidQuizIdError();
    }

    const questionIndex = Number(_questionIndex);
    const isQuestionIndexValid = 0 <= questionIndex && questionIndex < QuizManager.count(quiz.name);
    if (!isQuestionIndexValid) {
        throw new InvalidQuestionIndexError();
    }

    return { quizId, questionIndex };
}



type RequestBody = Vote;

const VoteController: RequestHandler = async (req, res, next) => {
    try {
        const { vote } = req.body as RequestBody;
        const { username } = req.user!;

        const { quizId, questionIndex } = await validateParams(req.params);

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
        const quiz = await APP_DB.getQuiz(quizId) as Quiz;

        // Find out whether all users have voted up until current question
        const playersWhoVoted = await APP_DB.getPlayersWhoVotedUpUntil(quizId, questionIndex);;
        const players = await APP_DB.getAllPlayers(quizId);
        logger.trace(`Players: ${players}`);
        logger.trace(`Players who voted so far (${playersWhoVoted.length}/${players.length}): ${playersWhoVoted}`);

        // If so: increment quiz's current question index
        if (playersWhoVoted.length === players.length) {
            logger.info(`All users have voted on question #${questionIndex + 1}.`);
            
            // That was not the last question and the game is not supervised:
            // the index can be automatically incremented
            if (questionIndex + 1 < QuizManager.count(quiz.name) && !quiz.status.isSupervised) {
                await APP_DB.incrementQuestionIndex(quizId);
            }

            // That was the last question: the game is now over
            else if (questionIndex + 1 === QuizManager.count(quiz.name)) {
                await APP_DB.finishQuiz(quizId);
            }
        }

        return res.json(
            successResponse({
                status: await APP_DB.getQuizStatus(quizId),
                votes,
            }
        ));

    } catch (err: any) {
        next(err);
    }
}

export default VoteController;