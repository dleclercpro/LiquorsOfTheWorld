import { useState, useEffect, useRef, useCallback } from 'react';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
import { NO_TIME } from '../constants';

interface TimerOptions {
  duration: TimeDuration; // Countdown duration
  interval?: TimeDuration; // Interval
  autoStart?: boolean; // Whether to start the timer immediately
}

const useCountdownTimer = ({ duration, interval = new TimeDuration(1, TimeUnit.Second), autoStart = false }: TimerOptions) => {
  const [time, setTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (time.smallerThan(NO_TIME)) {
    throw new Error('Cannot start a timer with a negative duration!');
  }

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      setIsDone(false);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setIsDone(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRunning]);

  const restart = useCallback(() => {
    if (isRunning) {
      stop();
    }
    start();
  }, [isRunning]);


  // Update timer's duration on each change
  useEffect(() => {
    if (!duration.equals(time)) {
      setTime(duration);
    }
  }, [duration]);

  
  // Handle timer start
  useEffect(() => {
    if (isRunning) {
      const updateTimer = () => {
        setTime((prevTime: TimeDuration) => {

          // Less time left than interval: set timer to zero next
          if (prevTime.smallerThanOrEquals(interval)) {
            setIsRunning(false);
            setIsDone(true);

            clearInterval(timerRef.current!);
            return new TimeDuration(0, TimeUnit.Millisecond);
          }

          return prevTime.subtract(interval);
        });
      };

      // Define interval
      timerRef.current = setInterval(updateTimer, interval.toMs().getAmount());

      // Cleanup function to clear the interval when the component unmounts or when dependencies change
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isRunning, interval]);


  // Handle timer stop (clean up interval)
  useEffect(() => {
    if (!isRunning && timerRef.current) {
      setIsRunning(false);
      setIsDone(false);

      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isRunning]);


  return { time, isRunning, isDone, start, stop, restart };
};

export default useCountdownTimer;