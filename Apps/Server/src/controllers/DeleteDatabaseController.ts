import { RequestHandler } from 'express';
import logger from '../logger';
import { APP_DB } from '..';
import { successResponse } from '../utils/calls';
import UserCannotDeleteDatabaseError from '../errors/UserCannotDeleteDatabase';

const DeleteDatabaseController: RequestHandler = async (req, res, next) => {
    try {
        const { username, isAdmin } = req.user!;

        // User needs to be admin to delete database
        if (!isAdmin) {
            throw new UserCannotDeleteDatabaseError();
        }

        await APP_DB.flush();
        logger.info(`Database has been deleted by admin '${username}'.`);

        return res.json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default DeleteDatabaseController;