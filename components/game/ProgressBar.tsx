import { View, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  useEffect,
} from 'react-native-reanimated';

type ProgressBarProps = {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
};

export default function ProgressBar({ 
  current, 
  total, 
  color = '#0ea5e9',
  showLabel = true 
}: ProgressBarProps) {
  const progress = (current / total) * 100;
  const animatedWidth = useSharedValue(0);

  // Update animation when progress changes
  animatedWidth.value = withSpring(progress, {
    damping: 15,
    stiffness: 100,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View className="w-full">
      {showLabel && (
        <View className="flex-row justify-between mb-1">
          <Text className="text-slate-500 text-xs">{current}/{total}</Text>
          <Text className="text-slate-500 text-xs">{Math.round(progress)}%</Text>
        </View>
      )}
      <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <Animated.View 
          className="h-full rounded-full"
          style={[animatedStyle, { backgroundColor: color }]}
        />
      </View>
    </View>
  );
}

