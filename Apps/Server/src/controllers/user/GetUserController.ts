import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { User } from '../../types/UserTypes';

const GetUserController: RequestHandler = async (req, res, next) => {
    try {
        const { username, isAdmin } = req.user!;

        return res.json(successResponse<User>({
            username,
            isAdmin,
        }));

    } catch (err: any) {
        next(err);
    }
}

export default GetUserController;