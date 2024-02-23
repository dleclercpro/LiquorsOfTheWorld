import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { QUESTIONS_EN, QUESTIONS_DE } from '../../constants';
import { ParamsDictionary } from 'express-serve-static-core';

const validateParams = (params: ParamsDictionary) => {
    const { lang } = params;

    if (!['en', 'de'].includes(lang)) {
        throw new Error('INVALID_LANGUAGE');
    }

    return { lang };
}



const GetQuestionsController: RequestHandler = (req, res, next) => {
    try {
        const { lang } = validateParams(req.params);

        let questions;

        switch (lang) {
            case 'en':
                questions = QUESTIONS_EN;
                break;
            case 'de':
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