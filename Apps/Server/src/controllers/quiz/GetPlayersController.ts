import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { ParamsDictionary } from 'express-serve-static-core';
import InvalidQuizIdError from '../../errors/InvalidQuizIdError';
import InvalidParamsError from '../../errors/InvalidParamsError';
import { PlayersData } from '../../types/DataTypes';
import Quiz from '../../models/Quiz';

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



const GetPlayersController: RequestHandler = async (req, res, next) => {
    try {
        const { quiz } = await validateParams(req.params);

        const players: PlayersData = quiz.getPlayers();

        return res.json(
            successResponse(players)
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetPlayersController;