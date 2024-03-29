import { RequestHandler } from 'express';
import logger from '../../logger';
import { successResponse } from '../../utils/calls';

const PingController: RequestHandler = async (req, res, next) => {
    try {
        const { username, isAdmin } = req.user!;
        const quizId = req.quizId!;
        
        return res
            .json(successResponse({
                quizId,
                username,
                isAdmin,
            }));

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        next(err);
    }
}

export default PingController;