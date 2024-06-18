import { RequestHandler } from 'express';
import logger from '../logger';
import { APP_DB } from '..';
import { successResponse } from '../utils/calls';
import UserCannotDeleteDatabaseError from '../errors/UserCannotDeleteDatabase';
import { COOKIE_NAME, COOKIE_OPTIONS, DEBUG } from '../config';

const DeleteDatabaseController: RequestHandler = async (req, res, next) => {
    try {
        if (DEBUG) {
            logger.warn(`Deleting database in debug mode!`);
        } else {
            const user = req.user!;

            logger.info(`Deleting database on demand of admin '${user.username}'.`);

            // User needs to be admin to delete database
            if (!user.isAdmin) {
                throw new UserCannotDeleteDatabaseError();
            }
        }

        await APP_DB.flush();

        // Log user out after deleting database
        return res
            .clearCookie(COOKIE_NAME, COOKIE_OPTIONS)
            .json(successResponse());

    } catch (err: any) {
        next(err);
    }
}

export default DeleteDatabaseController;