import { View, ViewProps } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type CardProps = ViewProps & {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  delay?: number;
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  animated = false,
  delay = 0,
  className = '',
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white shadow-lg';
      case 'bordered':
        return 'bg-white border border-slate-200';
      default:
        return 'bg-white';
    }
  };

  const cardStyles = `rounded-2xl ${paddingStyles[padding]} ${getVariantStyles()} ${className}`;
  
  const elevationStyle = variant === 'elevated' ? {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } : {};

  if (animated) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).springify()}
        className={cardStyles}
        style={elevationStyle}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <View className={cardStyles} style={elevationStyle} {...props}>
      {children}
    </View>
  );
}

