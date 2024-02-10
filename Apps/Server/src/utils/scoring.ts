import { REDIS_DB } from '..';
import logger from '../logger';
import { getLastValue } from './array';
import QUIZ from '../../data/quiz.json';
import { sum } from './math';

const SEPARATOR = '|';
const ANSWERS = QUIZ.map(({ answer }) => answer);

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
}