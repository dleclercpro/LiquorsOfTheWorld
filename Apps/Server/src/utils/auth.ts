import bcrypt from 'bcrypt';
import { REDIS_DB } from '..';
import { N_SALT_ROUNDS } from '../config';
import logger from '../logger';

export const isPasswordValid = async (password: string, hashedPassword: string) => {
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

export const createUser = async (username: string, password: string) => {
  logger.trace(`Adding user to Redis DB: ${username}`);

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

  await REDIS_DB.set(`users:${username}`, hashedPassword);

  logger.trace(`Added user to database: ${username}`);
}