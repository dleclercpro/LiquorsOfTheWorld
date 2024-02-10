import { REDIS_DB } from '..';
import logger from '../logger';
import { getAllUsers } from './users';

export const getAllVotes = async () => {
    const votes = await REDIS_DB.get(`votes`);

    return votes;
}

export const computeScores = async () => {
    const users = await getAllUsers();
    const votes = getAllVotes();

    logger.warn(users);
    logger.warn(votes);
}