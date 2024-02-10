import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';
import { Auth } from '../types';
import { N_SALT_ROUNDS } from '../config';

type RequestBody = Auth;

const addUser = async (username: string, password: string) => {
    logger.trace(`Trying to add user: ${username}`);

    // Hash the password
    const hashedPassword = await new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, N_SALT_ROUNDS, async (err, hash) => {
            if (err) {
                logger.fatal(`Error while hashing password for user: ${username}`, err);
                reject(new Error('CANNOT_HASH_PASSWORD'));
            }

            resolve(hash);
        });
    });

    await REDIS_DB.set(`user:${username}`, hashedPassword);

    logger.trace(`Added user to database: ${username}`);
}



const validatePassword = async (password: string, hashedPassword: string) => {

    // Compare the entered password to the stored hash
    await new Promise<void>((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                logger.error('CANNOT_VALIDATE_PASSWORD', err);
                return reject();
            }

            if (!result) {
                return reject(new Error('INVALID_PASSWORD'));
            }

            resolve();
        });
    });
}



const LoginController: RequestHandler = async (req, res, next) => {
    try {
        const { username, password } = req.body as RequestBody;

        if (await REDIS_DB.has(`user:${username}`)) {
            const hashedPassword = await REDIS_DB.get(`user:${username}`) ?? '';

            await validatePassword(password, hashedPassword);
        } else {
            await addUser(username, password);
        }
        
        return res.json(successResponse());

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        // Do not tell client why user can't sign in: just say that
        // their credentials are invalid
        if (['USER_ALREADY_EXISTS', 'INVALID_PASSWORD'].includes(err.message)) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse('INVALID_CREDENTIALS'));
        }

        next(err);
    }
}

export default LoginController;