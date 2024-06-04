import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import Quiz from '../../models/Quiz';
import { CallGetTeamsResponseData } from '../../types/DataTypes';
import { TEAMS } from '../../config';

const validateParams = async (params: ParamsDictionary) => {
    const { quizId } = params;

    if (quizId === undefined) {
        throw new InvalidParamsError();
    }

    const quiz = await Quiz.get(quizId);
    if (!quiz) {
        throw new InvalidQuizIdError();
    }

    return { quiz };
}



const GetTeamsController: RequestHandler = async (req, res, next) => {
    try {
        await validateParams(req.params);

        const response: CallGetTeamsResponseData = TEAMS.map((team) => team.id);

        return res.json(
            successResponse(response)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetTeamsController;