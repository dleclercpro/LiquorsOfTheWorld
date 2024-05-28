import { RequestHandler } from 'express';
import logger from '../../logger';
import { APP_DB } from '../..';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidQuestionIndexError from '../../errors/InvalidQuestionIndexError';
import UserCannotStartQuestionError from '../../errors/UserCannotStartQuestionError';
import UserCannotStartUnsupervisedQuestionError from '../../errors/UserCannotStartUnsupervisedQuestionError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import QuizManager from '../../models/QuizManager';
import Quiz from '../../models/users/Quiz';

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
    const isQuestionIndexValid = 0 <= questionIndex && questionIndex < questionCount;
    if (!isQuestionIndexValid) {
        throw new InvalidQuestionIndexError();
    }

    return { quiz, questionIndex };
}



const StartQuestionController: RequestHandler = async (req, res, next) => {
    try {
        const { username, isAdmin } = req.user!;

        const { quiz, questionIndex } = await validateParams(req.params);

        // User needs to be admin to start question
        if (!isAdmin) {
            throw new UserCannotStartQuestionError();
        }

        // Starting a question requires the quiz to be supervised
        if (!quiz.isSupervised()) {
            throw new UserCannotStartUnsupervisedQuestionError();
        }
        const questionCount = await QuizManager.count(quiz.getName());

        // Admins can only start next question index
        const currentQuestionIndex = await quiz.getQuestionIndex();
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (questionIndex !== nextQuestionIndex) {
            logger.error(`Trying to start question #${questionIndex} while the next one is #${nextQuestionIndex}!`);
            throw new InvalidQuestionIndexError();
        }

        // Find out whether all users have voted up until current question
        const playersWhoVoted = await APP_DB.getPlayersWhoVotedUpUntil(quiz.getId(), currentQuestionIndex);;
        const players = quiz.getPlayers();
        logger.trace(`Players: ${players}`);
        logger.trace(`Players who voted so far (${playersWhoVoted.length}/${players.length}): ${playersWhoVoted}`);

        // Restart timer for new question
        if (quiz.isTimed()) {
            await quiz.restartTimer();
            logger.debug(`Restarted timer.`);
        }

        // We can finally move on to next question
        await quiz.incrementQuestionIndex();
        logger.info(`Question ${questionIndex + 1}/${questionCount} of quiz '${quiz.getId()}' has been started by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default StartQuestionController;