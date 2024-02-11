import { RequestHandler } from 'express';
import logger from '../logger';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { User } from '../types/UserTypes';

const GetUserController: RequestHandler = async (req, res, next) => {
    try {
        const user = req.user!;

        return res.json(successResponse<User>({
            username: user.username,
            questionIndex: user.questionIndex,
        }));

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

export default GetUserController;