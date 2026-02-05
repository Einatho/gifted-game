import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  ZoomIn, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  size?: number;
  animated?: boolean;
  delay?: number;
};

export default function StarRating({
  rating,
  maxRating = 3,
  size = 32,
  animated = true,
  delay = 0,
}: StarRatingProps) {
  return (
    <View className="flex-row justify-center items-center">
      {[...Array(maxRating)].map((_, index) => {
        const isFilled = index < rating;
        
        if (animated) {
          return (
            <AnimatedStar
              key={index}
              isFilled={isFilled}
              size={size}
              delay={delay + index * 200}
            />
          );
        }
        
        return (
          <View key={index} className="mx-1">
            <Ionicons
              name={isFilled ? 'star' : 'star-outline'}
              size={size}
              color={isFilled ? '#fbbf24' : '#e2e8f0'}
            />
          </View>
        );
      })}
    </View>
  );
}

function AnimatedStar({ 
  isFilled, 
  size, 
  delay 
}: { 
  isFilled: boolean; 
  size: number; 
  delay: number;
}) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isFilled) {
      // Sparkle animation for filled stars
      rotation.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [isFilled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).springify()}
      style={animatedStyle}
      className="mx-1"
    >
      <Ionicons
        name={isFilled ? 'star' : 'star-outline'}
        size={size}
        color={isFilled ? '#fbbf24' : '#e2e8f0'}
      />
      {isFilled && (
        <View 
          className="absolute inset-0 items-center justify-center"
          style={{ opacity: 0.5 }}
        >
          <View className="w-1 h-1 bg-white rounded-full absolute top-1 right-1" />
          <View className="w-0.5 h-0.5 bg-white rounded-full absolute top-2 left-2" />
        </View>
      )}
    </Animated.View>
  );
}

