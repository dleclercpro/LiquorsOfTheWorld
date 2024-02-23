import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { QUESTIONS_EN, QUESTIONS_DE, LANGUAGES, Language } from '../../constants';
import { ParamsDictionary } from 'express-serve-static-core';

const validateParams = (params: ParamsDictionary) => {
    const { lang } = params;

    if (!LANGUAGES.includes(lang as Language)) {
        throw new Error('INVALID_LANGUAGE');
    }

    return { lang };
}



const GetQuestionsController: RequestHandler = (req, res, next) => {
    try {
        const { lang } = validateParams(req.params);

        let questions;

        switch (lang) {
            case Language.EN:
                questions = QUESTIONS_EN;
                break;
            case Language.DE:
                questions = QUESTIONS_DE;
                break;
            default:
                throw new Error('INVALID_LANGUAGE');
        }

        return res.json(
            successResponse(questions)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetQuestionsController;