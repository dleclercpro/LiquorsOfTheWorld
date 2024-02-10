import { REDIS_DB } from '..';
import { ANSWERS } from '../constants';
import { getLastValue } from './array';
import { sum } from './math';

const SEPARATOR = '|';

export const getAllVotes = async (): Promise<Record<string, number[]>> => {
    const rawVotes = await REDIS_DB.getKeysByPattern(`votes:*`);

    const votes: Record<string, number[]> = {};

    await Promise.all(rawVotes.map(async (key: string) => {
        const username = getLastValue<string>(key.split(':'));

        if (!username) {
            throw new Error('INVALID_VOTE');
        }

        const userVotes = await REDIS_DB.get(`votes:${username}`);

        if (userVotes !== null) {
            votes[username] = userVotes.split(SEPARATOR).map(Number);
        }
    }));

    return votes;
}

export const computeScores = async () => {
    const votes = await getAllVotes();

    const scores = Object.entries(votes).reduce((prev, [username, vote]) => {
        const userScore = sum(ANSWERS
            .map((ans, i) => i < vote.length && ans === vote[i])
            .map(Number));

        return {
            ...prev,
            [username]: userScore,
        };
    }, {});

    return scores;
}