import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  gradient?: [string, string];
};

const sizeStyles = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
};

const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  disabled = false,
  loading = false,
  fullWidth = false,
  gradient,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500';
      case 'secondary':
        return 'bg-slate-200';
      case 'outline':
        return 'bg-transparent border-2 border-primary-500';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-primary-500';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-slate-700';
      case 'outline':
        return 'text-primary-500';
      case 'ghost':
        return 'text-primary-500';
      default:
        return 'text-white';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return 'white';
      case 'secondary':
        return '#334155';
      case 'outline':
      case 'ghost':
        return '#0ea5e9';
      default:
        return 'white';
    }
  };

  const content = (
    <View className={`flex-row items-center justify-center ${iconPosition === 'left' ? 'flex-row-reverse' : ''}`}>
      {loading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <>
          <Text className={`font-bold ${textSizeStyles[size]} ${getTextColor()}`}>
            {title}
          </Text>
          {icon && (
            <View className={iconPosition === 'left' ? 'ml-2' : 'mr-2'}>
              <Ionicons name={icon} size={iconSizes[size]} color={getIconColor()} />
            </View>
          )}
        </>
      )}
    </View>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        className={fullWidth ? 'w-full' : ''}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`rounded-2xl ${sizeStyles[size]} ${isDisabled ? 'opacity-50' : ''}`}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        rounded-2xl ${sizeStyles[size]} ${getVariantStyles()}
        ${isDisabled ? 'opacity-50' : ''}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {content}
    </TouchableOpacity>
  );
}

