import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { COOKIE_NAME } from '../../config';
import { decodeCookie } from '../../utils/cookies';
import { CallPingResponseData } from '../../types/DataTypes';
import { QUIZ_LABELS, QuizName } from '../../constants';

const PingController: RequestHandler = async (req, res, next) => {
    try {
        const cookies = req.cookies;

        // Try to decode JWT cookie to rebuild user object
        const cookie = cookies[COOKIE_NAME] ? decodeCookie(cookies[COOKIE_NAME]) : null;

        const quizName: QuizName = cookie!.quiz.name;

        const response: CallPingResponseData = {
            quiz: {
                id: cookie ? cookie.quiz.id : null,
                name: quizName,
                label: QUIZ_LABELS[quizName],
            },
            user: {
                username: cookie ? cookie.user.username : null,
                teamId: cookie ? cookie.user.teamId : null,
                isAdmin: cookie ? cookie.user.isAdmin : false,
                isAuthenticated: Boolean(cookie),
            },
        };

        return res.json(successResponse(response));

    } catch (err: any) {
        next(err);
    }
}

export default PingController;