import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { errorResponse, successResponse } from '../../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../../types/HTTPTypes';
import { ParamsDictionary } from 'express-serve-static-core';
import { QUESTIONS } from '../../constants';
import { QuizGame } from '../../types/QuizTypes';

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



const StartQuestionController: RequestHandler = async (req, res, next) => {
    try {
        const { username, isAdmin } = req.user!;

        const { quizId, questionIndex } = await validateParams(req.params);

        // User needs to be admin to start question
        if (!isAdmin) {
            throw new Error('USER_CANNOT_START_QUESTION');
        }

        // Starting a question requires the quiz to be supervised
        const quiz = await APP_DB.getQuiz(quizId) as QuizGame;
        if (!quiz.isSupervised) {
            throw new Error('CANNOT_START_UNSUPERVISED_QUESTION');
        }

        // Players can only vote on next question index
        const currentQuestionIndex = await APP_DB.getQuestionIndex(quizId);
        if (questionIndex !== currentQuestionIndex + 1) {
            throw new Error('WRONG_QUESTION_INDEX');
        }

        // Find out whether all users have voted up until current question
        const playersWhoVoted = await APP_DB.getPlayersWhoVotedUpUntil(quizId, currentQuestionIndex);;
        const players = await APP_DB.getAllPlayers(quizId);
        logger.trace(`Players: ${players}`);
        logger.trace(`Players who voted so far (${playersWhoVoted.length}/${players.length}): ${playersWhoVoted}`);

        // If not: cannot increment quiz's current question index
        if (playersWhoVoted.length !== players.length) {
            throw new Error('PREVIOUS_QUESTIONS_INCOMPLETE');
        }

        await APP_DB.incrementQuestionIndex(quizId);
        logger.info(`Question ${questionIndex + 1}/${QUESTIONS.length} of quiz '${quizId}' has been started by admin '${username}'.`);

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

export default StartQuestionController;