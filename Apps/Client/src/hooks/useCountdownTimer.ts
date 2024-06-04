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
  const [time, setTime] = useState(NO_TIME);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  


  if (duration.smallerThan(NO_TIME)) {
    throw new Error('NEGATIVE_TIMER_DURATION');
  }



  const start = useCallback(() => {
    if (!isRunning) {
      setTime(duration); // Set time on timer for this run

      setIsRunning(true);
      setIsDone(false);
    }
  }, [isRunning, isDone, duration]);



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
  }, [isRunning, stop, start]);



  // Handle timer start
  useEffect(() => {
    if (!isRunning) return;

    const updateTimer = () => {
      setTime((prevTime) => {
        if (prevTime.smallerThanOrEquals(interval)) { // Less time left than interval: set timer to zero next
          setIsRunning(false);
          setIsDone(true);

          clearInterval(timerRef.current!);
          return NO_TIME;
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
        timerRef.current = null;
      }
    };
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



  // Handle autoStart logic separately
  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);



  return { time, isRunning, isDone, start, stop, restart };
};

export default useCountdownTimer;