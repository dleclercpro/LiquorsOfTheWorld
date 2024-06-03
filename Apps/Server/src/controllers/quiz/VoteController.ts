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

    const isQuestionIndexValid = (0 <= questionIndex) && (questionIndex <= questionCount - 1);
    if (!isQuestionIndexValid) {
        throw new InvalidQuestionIndexError();
    }

    return { quizId, questionIndex };
}



type RequestBody = QuizVote;

const VoteController: RequestHandler = async (req, res, next) => {
    try {
        const { vote } = req.body as RequestBody;
        const { username, isAdmin } = req.user!;

        const { quizId, questionIndex } = await validateParams(req.params);

        // If quiz is not supervised: increment question index
        const quiz = await Quiz.get(quizId);
        if (!quiz) {
            throw new InvalidQuizIdError();
        }
        const nextQuestionIndex = questionIndex + 1;
        const questionIndexAsString = questionIndex + 1;
        const questionCount = await QuizManager.count(quiz.getName());
        const isLastQuestion = nextQuestionIndex === questionCount;

        // Get votes from DB if they exist
        const votes = await APP_DB.getUserVotes(quizId, username);
        const questions = await QuizManager.get(quiz.getName(), quiz.getLanguage());
        const selectedAnswer = questions[questionIndex].options[vote];

        // Add vote to array
        votes[questionIndex] = vote;
        logger.debug(`New vote for user '${username}': Q${questionIndexAsString} -> ${selectedAnswer}`);

        // Store votes in DB
        await APP_DB.setUserVotes(quizId, username, votes);

        // Update vote counts
        await quiz.updateVoteCounts();

        // Find out how many users have voted on current question
        const playersWhoVoted = await APP_DB.getPlayersWhoVoted(quizId, questionIndex);
        const players = quiz.getPlayers();
        const haveAllPlayersVoted = playersWhoVoted.length === players.length;
        logger.trace(`Players who voted so far on question #${questionIndexAsString}: ${playersWhoVoted.length}/${players.length}`);

        if (!quiz.isSupervised() && haveAllPlayersVoted) {
            logger.info(`All users have voted on question #${questionIndexAsString}.`);
            
            // That was not the last question and the game is not supervised:
            // the index can be automatically incremented
            if (nextQuestionIndex < questionCount) {
                await quiz.incrementQuestionIndex();
            }

            // That was the last question: the game is now over
            else if (nextQuestionIndex === questionCount) {
                await quiz.finish();
            }

            // Wrong index
            else {
                throw new InvalidQuestionIndexError();
            }
        }

        // Admin has closed last question
        if (quiz.isSupervised() && isAdmin && isLastQuestion) {
            await quiz.finish();
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