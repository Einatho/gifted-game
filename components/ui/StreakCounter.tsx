import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

type StreakCounterProps = {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
};

const sizeStyles = {
  sm: { container: 'px-3 py-1', icon: 16, text: 'text-sm' },
  md: { container: 'px-4 py-2', icon: 20, text: 'text-base' },
  lg: { container: 'px-5 py-3', icon: 28, text: 'text-xl' },
};

export default function StreakCounter({
  streak,
  size = 'md',
  animated = true,
}: StreakCounterProps) {
  const styles = sizeStyles[size];
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (animated && streak > 0) {
      // Flame animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        true
      );
      
      rotation.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 200 }),
          withTiming(3, { duration: 200 }),
          withTiming(0, { duration: 200 })
        ),
        -1
      );
    }
  }, [streak, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const getStreakColor = () => {
    if (streak >= 7) return { bg: '#fef3c7', text: '#b45309', icon: '#f59e0b' };
    if (streak >= 3) return { bg: '#fed7aa', text: '#c2410c', icon: '#f97316' };
    return { bg: '#fee2e2', text: '#dc2626', icon: '#ef4444' };
  };

  const colors = getStreakColor();

  if (streak === 0) {
    return (
      <View 
        className={`flex-row items-center rounded-full ${styles.container}`}
        style={{ backgroundColor: '#f1f5f9' }}
      >
        <Ionicons name="flame-outline" size={styles.icon} color="#94a3b8" />
        <Text className={`${styles.text} font-bold text-slate-400 mr-1`}>
          0
        </Text>
      </View>
    );
  }

  return (
    <View 
      className={`flex-row items-center rounded-full ${styles.container}`}
      style={{ backgroundColor: colors.bg }}
    >
      <Animated.View style={animated ? animatedStyle : {}}>
        <Ionicons name="flame" size={styles.icon} color={colors.icon} />
      </Animated.View>
      <Text 
        className={`${styles.text} font-bold mr-1`}
        style={{ color: colors.text }}
      >
        {streak}
      </Text>
    </View>
  );
}

