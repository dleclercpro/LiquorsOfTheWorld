import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
import useTimer from './useTimer';
import { NO_TIME } from '../constants';
import useQuiz from './useQuiz';

const useServerTimer = (interval: TimeDuration = new TimeDuration(1, TimeUnit.Second)) => {
  const quiz = useQuiz();
  const data = quiz.status?.timer;

  const isEnabled = Boolean(data);
  
  const duration = data?.duration ? new TimeDuration(data.duration.amount, data.duration.unit) : NO_TIME;
  const startedAt = data?.startedAt ? new Date(data.startedAt) : new Date();
  const expiresAt = data?.expiresAt ? new Date(data.expiresAt) : startedAt;

  let remainingTime = new TimeDuration(expiresAt.getTime() - new Date().getTime(), TimeUnit.Millisecond);

  if (remainingTime.smallerThan(NO_TIME)) {
    remainingTime = NO_TIME;
  }

  const localTimer = useTimer({
    interval,
    duration: remainingTime,
    autoStart: false,
  });

  return {
    isEnabled,
    duration,
    startedAt,
    expiresAt,
    isRunning: localTimer.isRunning,
    isDone: localTimer.isDone,
    time: localTimer.time,
    start: localTimer.start,
    stop: localTimer.stop,
    restart: localTimer.restart,
  };
};

export default useServerTimer;