import { RequestHandler } from 'express';
import { join } from 'path';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidParamsError from '../../errors/InvalidParamsError';
import { QUIZ_NAMES, QuizName } from '../../constants';
import InvalidQuizNameError from '../../errors/InvalidQuizNameError';
import { listFiles } from '../../utils/file';
import { PUBLIC_DIR } from '../../config';
import { getRandom } from '../../utils/array';

const validateParams = async (params: ParamsDictionary) => {
    const { quizName } = params;

    if (quizName === undefined) {
        throw new InvalidParamsError();
    }

    if (!QUIZ_NAMES.includes(quizName as QuizName)) {
        throw new InvalidQuizNameError();
    }

    return { quizName };
}



const GetBackgroundUrlController: RequestHandler = async (req, res, next) => {
    try {
        const { quizName } = await validateParams(req.params);

        const filenames = await listFiles(join(__dirname, `../../../public/img/bg/${quizName}`));
        const urls = filenames.map((filename) => `/static/img/bg/${quizName}/${filename}`);

        return res.json(successResponse(getRandom(urls)));

    } catch (err: any) {
        next(err);
    }
}

export default GetBackgroundUrlController;