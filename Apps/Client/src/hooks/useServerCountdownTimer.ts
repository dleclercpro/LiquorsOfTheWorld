import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
import useCountdownTimer from './useCountdownTimer';
import { NO_TIME } from '../constants';
import useQuiz from './useQuiz';

const useServerCountdownTimer = () => {
  const quiz = useQuiz();
  const data = quiz.status?.timer;

  const isEnabled = data?.isEnabled;
  const duration = data?.duration ? new TimeDuration(data.duration.amount, data.duration.unit) : NO_TIME;
  const startedAt = data?.startedAt ? new Date(data.startedAt) : new Date();

  console.log(isEnabled);

  const alreadySpentTime = new TimeDuration(new Date().getTime() - startedAt.getTime(), TimeUnit.Millisecond);
  let remainingTime = duration.subtract(alreadySpentTime);

  if (remainingTime.smallerThan(NO_TIME)) {
    remainingTime = NO_TIME;
  }

  const timer = useCountdownTimer({
    interval: new TimeDuration(1, TimeUnit.Second),
    duration: remainingTime,
    autoStart: false,
  });

  return {
    isEnabled,
    duration,
    startedAt,
    isRunning: timer.isRunning,
    isDone: timer.isDone,
    time: timer.time,
    start: timer.start,
    stop: timer.stop,
    restart: timer.restart,
  };
};

export default useServerCountdownTimer;