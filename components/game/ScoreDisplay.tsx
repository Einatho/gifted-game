import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';

type ScoreDisplayProps = {
  score: number;
  stars: number;
  previousScore?: number;
  previousStars?: number;
};

export default function ScoreDisplay({ 
  score, 
  stars, 
  previousScore = 0,
  previousStars = 0 
}: ScoreDisplayProps) {
  const scoreScale = useSharedValue(1);
  const starsScale = useSharedValue(1);

  useEffect(() => {
    if (score !== previousScore) {
      scoreScale.value = withSequence(
        withSpring(1.3, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
    }
  }, [score]);

  useEffect(() => {
    if (stars !== previousStars) {
      starsScale.value = withSequence(
        withSpring(1.3, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
    }
  }, [stars]);

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  const starsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starsScale.value }],
  }));

  return (
    <View className="flex-row items-center justify-center space-x-6">
      {/* Stars */}
      <Animated.View 
        style={starsAnimatedStyle}
        className="flex-row items-center bg-amber-100 rounded-full px-4 py-2"
      >
        <Ionicons name="star" size={20} color="#f59e0b" />
        <Text className="text-amber-700 font-bold text-lg mr-1">{stars}</Text>
      </Animated.View>

      {/* Score */}
      <Animated.View 
        style={scoreAnimatedStyle}
        className="flex-row items-center bg-primary-100 rounded-full px-4 py-2"
      >
        <Ionicons name="trophy" size={20} color="#0ea5e9" />
        <Text className="text-primary-700 font-bold text-lg mr-1">{score}</Text>
      </Animated.View>
    </View>
  );
}

