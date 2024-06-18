import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { LANGUAGES, Language } from '../../constants';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidLanguageError from '../../errors/InvalidLanguageError';
import QuizManager from '../../models/QuizManager';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import Quiz from '../../models/Quiz';
import { CallGetQuestionsResponseData } from '../../types/DataTypes';

const validateParams = async (params: ParamsDictionary) => {
    const { language, quizId } = params;

    if (!LANGUAGES.includes(language as Language)) {
        throw new InvalidLanguageError();
    }

    const quiz = await Quiz.get(quizId);
    if (!quiz) {
        throw new InvalidQuizIdError();
    }

    return { quiz };
}



const GetQuestionsController: RequestHandler = async (req, res, next) => {
    try {
        const { quiz } = await validateParams(req.params);

        const questions = await QuizManager.get(quiz.getName(), quiz.getLanguage());

        const reorderedQuestions: CallGetQuestionsResponseData = quiz.getQuestionOrder().map((i) => questions[i]);

        return res.json(
            successResponse(reorderedQuestions)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetQuestionsController;