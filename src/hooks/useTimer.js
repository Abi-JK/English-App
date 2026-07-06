import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (autoStart = false) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
  }, []);
  const restart = useCallback(() => {
    setTime(0);
    setIsRunning(true);
  }, []);

  const formatTime = useCallback((s = time) => {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }, [time]);

  return { time, isRunning, formatTime, start, stop, reset, restart };
};
