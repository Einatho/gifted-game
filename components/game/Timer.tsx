import { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

type TimerProps = {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;
  color: string;
};

export default function Timer({ duration, onTimeUp, isPaused, color }: TimerProps) {
  const progress = useSharedValue(1);
  const timeRemaining = useSharedValue(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    // Reset on duration change
    progress.value = 1;
    timeRemaining.value = duration;
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();

    // Start animation
    progress.value = withTiming(0, {
      duration: duration * 1000,
      easing: Easing.linear,
    });
  }, [duration]);

  useEffect(() => {
    if (isPaused) {
      // Store elapsed time when paused
      elapsedRef.current += (Date.now() - startTimeRef.current) / 1000;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Resume from where we left off
    startTimeRef.current = Date.now();
    const remaining = duration - elapsedRef.current;
    
    if (remaining <= 0) {
      onTimeUp();
      return;
    }

    // Update progress animation
    progress.value = remaining / duration;
    progress.value = withTiming(0, {
      duration: remaining * 1000,
      easing: Easing.linear,
    });

    // Update display timer
    intervalRef.current = setInterval(() => {
      const currentElapsed = elapsedRef.current + (Date.now() - startTimeRef.current) / 1000;
      const newRemaining = Math.max(0, duration - currentElapsed);
      timeRemaining.value = Math.ceil(newRemaining);

      if (newRemaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        runOnJS(onTimeUp)();
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, duration, onTimeUp]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    backgroundColor: progress.value > 0.3 ? color : progress.value > 0.15 ? '#f59e0b' : '#ef4444',
  }));

  const displayTime = Math.ceil(Math.max(0, duration - elapsedRef.current - (isPaused ? 0 : (Date.now() - startTimeRef.current) / 1000)));

  return (
    <View className="items-center">
      <View className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
        <Animated.View 
          className="h-full rounded-full"
          style={animatedBarStyle}
        />
      </View>
      <Text 
        className={`text-sm font-bold mt-1 ${
          displayTime <= 5 ? 'text-red-500' : displayTime <= 10 ? 'text-amber-500' : 'text-slate-600'
        }`}
      >
        {displayTime}
      </Text>
    </View>
  );
}

