import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#fbbf24', // gold
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
];

const NUM_CONFETTI = 50;

type ConfettiPieceProps = {
  index: number;
  onComplete?: () => void;
  isLast: boolean;
};

function ConfettiPiece({ index, onComplete, isLast }: ConfettiPieceProps) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(Math.random() * 0.5 + 0.5);

  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const delay = Math.random() * 500;
  const duration = 2000 + Math.random() * 1000;
  const horizontalDrift = (Math.random() - 0.5) * 100;

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height + 50, {
        duration,
        easing: Easing.out(Easing.quad),
      }, () => {
        if (isLast && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );

    translateX.value = withDelay(
      delay,
      withTiming(translateX.value + horizontalDrift, {
        duration,
        easing: Easing.inOut(Easing.sin),
      })
    );

    rotate.value = withDelay(
      delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1) * 3, {
        duration,
        easing: Easing.linear,
      })
    );

    opacity.value = withDelay(
      delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const isCircle = index % 3 === 0;
  const isSquare = index % 3 === 1;

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.confetti,
        { backgroundColor: color },
        isCircle && styles.circle,
        isSquare && styles.square,
      ]}
    />
  );
}

type ConfettiProps = {
  trigger: boolean;
  onComplete?: () => void;
};

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  if (!trigger) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: NUM_CONFETTI }).map((_, index) => (
        <ConfettiPiece
          key={index}
          index={index}
          isLast={index === NUM_CONFETTI - 1}
          onComplete={onComplete}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
  },
  circle: {
    borderRadius: 5,
  },
  square: {
    borderRadius: 0,
  },
});

