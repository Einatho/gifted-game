import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Animated, { ZoomIn, FadeIn } from 'react-native-reanimated';

type AchievementBadgeProps = {
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  size?: 'sm' | 'md' | 'lg';
};

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  star: 'star',
  calculator: 'calculator',
  book: 'book',
  eye: 'eye',
  bulb: 'bulb',
  zap: 'flash',
  award: 'ribbon',
  calendar: 'calendar',
  stars: 'stars',
  trophy: 'trophy',
};

const sizeStyles = {
  sm: { badge: 'w-12 h-12', icon: 20, text: 'text-xs' },
  md: { badge: 'w-16 h-16', icon: 28, text: 'text-sm' },
  lg: { badge: 'w-20 h-20', icon: 36, text: 'text-base' },
};

export default function AchievementBadge({
  name,
  nameHe,
  description,
  descriptionHe,
  icon,
  isUnlocked,
  unlockedAt,
  progress = 0,
  target = 1,
  size = 'md',
}: AchievementBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const styles = sizeStyles[size];
  const progressPercent = Math.min((progress / target) * 100, 100);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
        className="items-center"
      >
        <View 
          className={`${styles.badge} rounded-full items-center justify-center ${
            isUnlocked ? 'bg-amber-400' : 'bg-slate-300'
          }`}
          style={isUnlocked ? {
            shadowColor: '#f59e0b',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
          } : {}}
        >
          <Ionicons 
            name={iconMap[icon] || 'star'} 
            size={styles.icon} 
            color={isUnlocked ? 'white' : '#94a3b8'} 
          />
        </View>
        
        {/* Progress ring for locked achievements */}
        {!isUnlocked && progress > 0 && (
          <View className="absolute inset-0 items-center justify-center">
            <View 
              className={`${styles.badge} rounded-full border-4 border-amber-400`}
              style={{
                opacity: progressPercent / 100,
              }}
            />
          </View>
        )}
        
        <Text 
          className={`${styles.text} mt-1 text-center ${
            isUnlocked ? 'text-slate-700 font-medium' : 'text-slate-400'
          }`}
          numberOfLines={2}
        >
          {nameHe}
        </Text>
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowModal(false)}
          className="flex-1 bg-black/50 items-center justify-center"
        >
          <Animated.View
            entering={ZoomIn.springify()}
            className="bg-white rounded-3xl p-6 mx-8 w-[80%] max-w-sm"
          >
            <View className="items-center">
              <View 
                className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${
                  isUnlocked ? 'bg-amber-400' : 'bg-slate-300'
                }`}
              >
                <Ionicons 
                  name={iconMap[icon] || 'star'} 
                  size={48} 
                  color={isUnlocked ? 'white' : '#94a3b8'} 
                />
              </View>
              
              <Text className="text-xl font-bold text-slate-800 text-center">
                {nameHe}
              </Text>
              <Text className="text-sm text-slate-500 text-center mb-4">
                {name}
              </Text>
              
              <Text className="text-slate-600 text-center mb-4">
                {descriptionHe}
              </Text>

              {/* Progress */}
              {!isUnlocked && (
                <View className="w-full mb-4">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-slate-400 text-xs">{progress}/{target}</Text>
                    <Text className="text-slate-400 text-xs">{Math.round(progressPercent)}%</Text>
                  </View>
                  <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </View>
                </View>
              )}

              {/* Unlock date */}
              {isUnlocked && unlockedAt && (
                <View className="bg-green-50 rounded-xl px-4 py-2 mb-4">
                  <Text className="text-green-700 text-sm text-center">
                    ✓ נפתח ב-{new Date(unlockedAt).toLocaleDateString('he-IL')}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="bg-primary-500 rounded-xl px-6 py-3"
              >
                <Text className="text-white font-bold">סגור</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

