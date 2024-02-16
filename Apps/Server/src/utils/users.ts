import bcrypt from 'bcrypt';
import { REDIS_DB } from '..';
import { N_SALT_ROUNDS } from '../config';
import logger from '../logger';
import { DatabaseUser } from '../types/UserTypes';
import { SEPARATOR } from '../constants';

export const createUser = async (username: string, password: string) => {
  logger.trace(`Adding user '${username}' to Redis DB...`);

  // Hash the password
  const hashedPassword = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(password, N_SALT_ROUNDS, async (err, hash) => {
          if (err) {
              logger.fatal(`Error while hashing password of user '${username}'.`, err);
              reject(new Error('CANNOT_HASH_PASSWORD'));
          }

          resolve(hash);
      });
  });

  logger.trace(`Creating user '${username}' in database...`);
  const user = { username, hashedPassword, questionIndex: 0 };

  await REDIS_DB.set(`users:${username}`, JSON.stringify(user as DatabaseUser));

  return user;
}

export const getVotesOfUser = async (quizId: string, username: string) => {
    const key = `votes:${quizId}:${username}`;
    
    if (await REDIS_DB.has(key)) {
        const votes = await REDIS_DB.get(key);
        
        return votes!
            .split(SEPARATOR)
            .map(Number);
    }
    
    return [];
}

export const getAllUsers = async () => {
    return REDIS_DB.getKeysByPattern(`users:*`);
}