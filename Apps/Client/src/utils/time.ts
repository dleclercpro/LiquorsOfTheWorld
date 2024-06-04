import TimeDuration from '../models/TimeDuration';

export const sleep = async (duration: TimeDuration) => {
  const ms = duration.toMs().getAmount();

  await new Promise(resolve => setTimeout(resolve, ms));
};