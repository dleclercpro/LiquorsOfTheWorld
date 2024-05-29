import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { successResponse } from '../../utils/calls';
import { QuizVote } from '../../types/QuizTypes';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import InvalidQuestionIndexError from '../../errors/InvalidQuestionIndexError';
import QuizManager from '../../models/QuizManager';
import Quiz from '../../models/Quiz';
import { CallVoteResponseData } from '../../types/DataTypes';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId, questionIndex: _questionIndex } = params;

    if (quizId === undefined || _questionIndex === undefined) {
        throw new InvalidParamsError();
    }

    const quiz = await Quiz.get(quizId);
    if (!quiz) {
        throw new InvalidQuizIdError();
    }

    const questionIndex = Number(_questionIndex);
    const questionCount = await QuizManager.count(quiz.getName());
    const isQuestionIndexValid = (0 <= questionIndex) && (questionIndex + 1 <= questionCount);
    if (!isQuestionIndexValid) {
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

        // Get votes from DB if they exist
        const votes = await APP_DB.getUserVotes(quizId, username);

        // Add vote to array
        votes[questionIndex] = vote;

        // Store votes in DB
        await APP_DB.setUserVotes(quizId, username, votes);

        // If quiz is not supervised: increment question index
        const quiz = await Quiz.get(quizId);
        if (!quiz) {
            throw new InvalidQuizIdError();
        }
        const questionCount = await QuizManager.count(quiz.getName());

        // Find out whether all users have voted up until current question
        const playersWhoVoted = await APP_DB.getPlayersWhoVoted(quizId, questionIndex);;
        const players = quiz.getPlayers();
        logger.trace(`Players: ${players}`);
        logger.trace(`Players who voted so far (${playersWhoVoted.length}/${players.length}): ${playersWhoVoted}`);

        // If so: increment quiz's current question index
        if (playersWhoVoted.length === players.length) {
            logger.info(`All users have voted on question #${questionIndex + 1}.`);
            
            // That was not the last question and the game is not supervised:
            // the index can be automatically incremented
            if (questionIndex + 1 < questionCount && !quiz.isSupervised()) {
                await quiz.incrementQuestionIndex();
            }

            // That was the last question: the game is now over
            else if (questionIndex + 1 === questionCount) {
                await quiz.finish();
            }
        }

        const response: CallVoteResponseData = {
            status: quiz.getStatus(),
            votes,
        };

        return res.json(
            successResponse(response)
        );

    } catch (err: any) {
        next(err);
    }
}

export default VoteController;