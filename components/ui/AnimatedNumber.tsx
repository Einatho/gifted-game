import { useEffect } from 'react';
import { Text, TextProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useDerivedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

type AnimatedNumberProps = TextProps & {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatOptions?: Intl.NumberFormatOptions;
};

export default function AnimatedNumber({
  value,
  duration = 500,
  prefix = '',
  suffix = '',
  formatOptions,
  style,
  ...textProps
}: AnimatedNumberProps) {
  const animatedValue = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Animate value change
    animatedValue.value = withTiming(value, { duration });
    
    // Pop animation on change
    scale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );
  }, [value, duration]);

  const displayValue = useDerivedValue(() => {
    const num = Math.round(animatedValue.value);
    
    if (formatOptions) {
      return prefix + new Intl.NumberFormat('he-IL', formatOptions).format(num) + suffix;
    }
    
    return prefix + num.toString() + suffix;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // For React Native, we need to use a different approach since
  // useAnimatedProps doesn't work well with text
  const derivedText = useDerivedValue(() => displayValue.value);

  return (
    <Animated.View style={animatedStyle}>
      <AnimatedText style={style} {...textProps}>
        {Math.round(value)}
      </AnimatedText>
    </Animated.View>
  );
}

// Simpler version using state
import { useState, useRef } from 'react';

export function AnimatedCounter({
  value,
  duration = 500,
  className = '',
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    const startValue = previousValue.current;
    const difference = value - startValue;
    const steps = Math.ceil(duration / 16); // ~60fps
    const increment = difference / steps;
    let currentStep = 0;

    animationRef.current = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        previousValue.current = value;
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      } else {
        setDisplayValue(Math.round(startValue + increment * currentStep));
      }
    }, 16);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <Text className={className}>
      {displayValue}
    </Text>
  );
}

