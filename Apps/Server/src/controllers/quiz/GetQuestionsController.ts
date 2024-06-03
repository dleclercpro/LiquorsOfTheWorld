import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { LANGUAGES, Language, QUIZ_NAMES, QuizName } from '../../constants';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidLanguageError from '../../errors/InvalidLanguageError';
import QuizManager from '../../models/QuizManager';
import InvalidQuizNameError from '../../errors/InvalidQuizNameError';

const validateParams = (params: ParamsDictionary) => {
    const { language, quizName } = params;

    if (!LANGUAGES.includes(language as Language)) {
        throw new InvalidLanguageError();
    }

    if (!QUIZ_NAMES.includes(quizName as QuizName)) {
        throw new InvalidQuizNameError();
    }

    return { language: language as Language, quizName: quizName as QuizName };
}



const GetQuestionsController: RequestHandler = async (req, res, next) => {
    try {
        const { language, quizName } = validateParams(req.params);

        const questions = await QuizManager.get(quizName, language);

        return res.json(
            successResponse(questions)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetQuestionsController;