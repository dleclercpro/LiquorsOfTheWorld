import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import logger from '../logger';
import { REDIS_DB } from '..';
import { errorResponse, successResponse } from '../utils/calls';
import { Auth } from '../types';
import { COOKIE_NAME, N_SALT_ROUNDS } from '../config';
import { encodeCookie } from '../utils/cookies';



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



const isPasswordValid = async (password: string, hashedPassword: string) => {
    const isValid = await new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                logger.error('CANNOT_VALIDATE_PASSWORD', err);
                return reject(false);
            }

            if (!result) {
                return reject(false);
            }

            resolve(true);
        });
    });

    return isValid;
}



type RequestBody = Auth;

const LoginController: RequestHandler = async (req, res, next) => {
    try {
        const { username, password } = req.body as RequestBody;

        if (await REDIS_DB.has(`users:${username}`)) {
            const hashedPassword = await REDIS_DB.get(`users:${username}`) as string;

            if (!await isPasswordValid(password, hashedPassword)) {
                throw new Error('INVALID_PASSWORD');
            }
        } else {
            await addUser(username, password);
        }
        
        return res
            .cookie(COOKIE_NAME, await encodeCookie({ username, password }))
            .json(successResponse());

    } catch (err: any) {
        if (err instanceof Error) {
            logger.warn(err.message);
        }

        // Do not tell client why user can't sign in: just say that
        // their credentials are invalid
        if (['USER_ALREADY_EXISTS', 'INVALID_PASSWORD'].includes(err.message)) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse('INVALID_CREDENTIALS'));
        }

        next(err);
    }
}

export default LoginController;