import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { COOKIE_NAME } from '../../config';
import { decodeCookie } from '../../utils/cookies';
import { CallPingResponseData } from '../../types/DataTypes';
import { QUIZ_LABELS } from '../../constants';

const PingController: RequestHandler = async (req, res, next) => {
    try {
        const cookies = req.cookies;

        // Try to decode JWT cookie to rebuild user object
        const cookie = cookies[COOKIE_NAME] ? decodeCookie(cookies[COOKIE_NAME]) : null;

        const response: CallPingResponseData = {
            ...(cookie ? {
                quiz: {
                    id: cookie.quiz.id,
                    name: cookie.quiz.name,
                    label: QUIZ_LABELS[cookie.quiz.name],
                },
                user: {
                    username: cookie.user.username,
                    teamId: cookie.user.teamId,
                    isAdmin: cookie.user.isAdmin,
                    isAuthenticated: true,
                },
            } : {

            }),
        };

        return res.json(successResponse(response));

    } catch (err: any) {
        next(err);
    }
}

export default PingController;