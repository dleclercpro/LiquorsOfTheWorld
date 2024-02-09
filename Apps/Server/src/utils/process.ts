import TimeDuration from '../models/units/TimeDuration';
import { sleep } from './time';

const kill = () => {
    process.exit(1);
}

export const killAfterTimeout = async (timeout: TimeDuration) => {
    await sleep(timeout);
    await kill();
}