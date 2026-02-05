import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

type LevelIndicatorProps = {
  level: number;
  maxLevel?: number;
  color?: string;
  showProgress?: boolean;
  compact?: boolean;
};

export default function LevelIndicator({
  level,
  maxLevel = 10,
  color = '#0ea5e9',
  showProgress = true,
  compact = false,
}: LevelIndicatorProps) {
  const progress = (level / maxLevel) * 100;

  if (compact) {
    return (
      <View 
        className="flex-row items-center px-3 py-1 rounded-full"
        style={{ backgroundColor: color + '20' }}
      >
        <Ionicons name="trophy" size={14} color={color} />
        <Text 
          className="text-sm font-bold mr-1"
          style={{ color }}
        >
          {level}
        </Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} className="items-center">
      {/* Level Badge */}
      <View 
        className="w-16 h-16 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: color + '20' }}
      >
        <Text 
          className="text-2xl font-bold"
          style={{ color }}
        >
          {level}
        </Text>
      </View>
      
      <Text className="text-slate-600 font-medium">שלב</Text>
      
      {/* Progress Bar */}
      {showProgress && (
        <View className="w-full mt-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-slate-400 text-xs">{level}/{maxLevel}</Text>
          </View>
          <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                width: `${progress}%`,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      )}
    </Animated.View>
  );
}

