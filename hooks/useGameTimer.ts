import { useState, useEffect, useCallback, useRef } from 'react';

interface UseGameTimerProps {
  duration: number;
  onTimeUp: () => void;
  autoStart?: boolean;
}

interface UseGameTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  getElapsedTime: () => number;
}

export function useGameTimer({
  duration,
  onTimeUp,
  autoStart = true,
}: UseGameTimerProps): UseGameTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    
    elapsedTimeRef.current += Date.now() - startTimeRef.current;
    setIsRunning(false);
    clearTimer();
  }, [isRunning, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setTimeRemaining(duration);
    elapsedTimeRef.current = 0;
    startTimeRef.current = Date.now();
    if (autoStart) {
      setIsRunning(true);
    }
  }, [duration, autoStart, clearTimer]);

  const getElapsedTime = useCallback(() => {
    if (isRunning) {
      return elapsedTimeRef.current + (Date.now() - startTimeRef.current);
    }
    return elapsedTimeRef.current;
  }, [isRunning]);

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;

    startTimeRef.current = Date.now() - elapsedTimeRef.current;

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      
      setTimeRemaining(Math.ceil(remaining));

      if (remaining <= 0) {
        clearTimer();
        setIsRunning(false);
        onTimeUp();
      }
    }, 100);

    return () => clearTimer();
  }, [isRunning, duration, onTimeUp, clearTimer]);

  // Reset when duration changes
  useEffect(() => {
    reset();
  }, [duration]);

  const progress = timeRemaining / duration;

  return {
    timeRemaining,
    isRunning,
    progress,
    start,
    pause,
    reset,
    getElapsedTime,
  };
}

