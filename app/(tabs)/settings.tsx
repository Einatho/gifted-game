import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/stores/gameStore';
import { INITIAL_PROGRESS } from '@/utils/constants';
import { UserProgress } from '@/utils/types';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
};

function SettingItem({ icon, iconColor, title, subtitle, onPress, rightElement }: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !rightElement}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center py-4 border-b border-slate-100"
    >
      {rightElement || (onPress && (
        <Ionicons name="chevron-back" size={20} color="#94a3b8" />
      ))}
      <View className="flex-1 mr-3">
        <Text className="text-slate-800 font-medium text-right">{title}</Text>
        {subtitle && (
          <Text className="text-slate-400 text-sm text-right mt-1">{subtitle}</Text>
        )}
      </View>
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center"
        style={{ backgroundColor: iconColor + '20' }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  
  const updateProgress = useGameStore((state) => state.updateProgress);
  const progress = useGameStore((state) => state.progress);

  const handleResetProgress = () => {
    Alert.alert(
      'איפוס התקדמות',
      'האם אתה בטוח שברצונך לאפס את כל ההתקדמות? פעולה זו בלתי הפיכה.',
      [
        { text: 'ביטול', style: 'cancel' },
        { 
          text: 'איפוס', 
          style: 'destructive',
          onPress: () => {
            updateProgress(INITIAL_PROGRESS as UserProgress);
            Alert.alert('בוצע', 'ההתקדמות אופסה בהצלחה');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.springify()}
          className="px-6 pt-4 pb-6"
        >
          <Text className="text-3xl font-bold text-slate-800 text-right">
            הגדרות ⚙️
          </Text>
          <Text className="text-slate-500 text-right mt-1">
            התאם את המשחק לצרכים שלך
          </Text>
        </Animated.View>

        {/* Sound & Feedback Section */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="mx-6 mb-6"
        >
          <Text className="text-lg font-bold text-slate-800 text-right mb-2">
            צלילים ומשוב
          </Text>
          <View className="bg-white rounded-2xl px-4">
            <SettingItem
              icon="volume-high"
              iconColor="#3b82f6"
              title="צלילים"
              subtitle="השמע צלילים בזמן המשחק"
              rightElement={
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
                  thumbColor={soundEnabled ? '#0ea5e9' : '#94a3b8'}
                />
              }
            />
            <SettingItem
              icon="phone-portrait"
              iconColor="#8b5cf6"
              title="רטט"
              subtitle="רטט בתשובות נכונות ושגויות"
              rightElement={
                <Switch
                  value={hapticsEnabled}
                  onValueChange={setHapticsEnabled}
                  trackColor={{ false: '#e2e8f0', true: '#ddd6fe' }}
                  thumbColor={hapticsEnabled ? '#8b5cf6' : '#94a3b8'}
                />
              }
            />
          </View>
        </Animated.View>

        {/* Gameplay Section */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="mx-6 mb-6"
        >
          <Text className="text-lg font-bold text-slate-800 text-right mb-2">
            משחק
          </Text>
          <View className="bg-white rounded-2xl px-4">
            <SettingItem
              icon="bulb"
              iconColor="#f59e0b"
              title="רמזים"
              subtitle="אפשר שימוש ברמזים (מפחית נקודות)"
              rightElement={
                <Switch
                  value={hintsEnabled}
                  onValueChange={setHintsEnabled}
                  trackColor={{ false: '#e2e8f0', true: '#fef3c7' }}
                  thumbColor={hintsEnabled ? '#f59e0b' : '#94a3b8'}
                />
              }
            />
          </View>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="mx-6 mb-6"
        >
          <Text className="text-lg font-bold text-slate-800 text-right mb-2">
            סטטיסטיקות
          </Text>
          <View className="bg-white rounded-2xl px-4">
            <SettingItem
              icon="stats-chart"
              iconColor="#10b981"
              title="שאלות שנענו"
              subtitle={`${progress.questionsAnswered} שאלות`}
            />
            <SettingItem
              icon="time"
              iconColor="#6366f1"
              title="זמן משחק כולל"
              subtitle="בקרוב..."
            />
          </View>
        </Animated.View>

        {/* Data Section */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="mx-6 mb-6"
        >
          <Text className="text-lg font-bold text-slate-800 text-right mb-2">
            נתונים
          </Text>
          <View className="bg-white rounded-2xl px-4">
            <SettingItem
              icon="refresh"
              iconColor="#ef4444"
              title="איפוס התקדמות"
              subtitle="מחק את כל הנתונים והתחל מחדש"
              onPress={handleResetProgress}
            />
          </View>
        </Animated.View>

        {/* About Section */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="mx-6 mb-6"
        >
          <Text className="text-lg font-bold text-slate-800 text-right mb-2">
            אודות
          </Text>
          <View className="bg-white rounded-2xl px-4">
            <SettingItem
              icon="information-circle"
              iconColor="#0ea5e9"
              title="גרסה"
              subtitle="1.0.0"
            />
            <SettingItem
              icon="heart"
              iconColor="#ec4899"
              title="נבנה עם אהבה"
              subtitle="להצלחה במבחן המחוננים"
            />
          </View>
        </Animated.View>

        {/* Parent Section */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          className="mx-6"
        >
          <View className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="people" size={20} color="#0ea5e9" />
              <Text className="text-primary-800 font-bold text-right flex-1 mr-2">להורים</Text>
            </View>
            <Text className="text-primary-700 text-right text-sm">
              אזור ההורים מאפשר מעקב מפורט אחר התקדמות הילד. 
              בקרוב יהיה זמין עם סיסמה מיוחדת.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

