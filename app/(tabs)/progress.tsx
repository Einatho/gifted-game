import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '@/stores/gameStore';
import { CATEGORY_INFO, ACHIEVEMENTS } from '@/utils/constants';
import { QuestionCategory } from '@/utils/types';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

function CategoryProgressCard({ category }: { category: QuestionCategory }) {
  const info = CATEGORY_INFO[category];
  const progress = useGameStore((state) => state.progress.categoryProgress[category]);
  
  const accuracy = progress.questionsCompleted > 0 
    ? Math.round((progress.correctAnswers / progress.questionsCompleted) * 100)
    : 0;

  const icons: Record<QuestionCategory, keyof typeof Ionicons.glyphMap> = {
    math: 'calculator',
    verbal: 'book',
    visual: 'shapes',
    logic: 'bulb',
  };

  return (
    <View 
      className="bg-white rounded-2xl p-4 mb-3"
      style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Text className="text-slate-400 text-sm">שלב {progress.currentLevel}/10</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-slate-800 mr-2">{info.nameHe}</Text>
          <View 
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: info.color + '20' }}
          >
            <Ionicons name={icons[category]} size={22} color={info.color} />
          </View>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View className="bg-slate-100 h-2 rounded-full mb-3 overflow-hidden">
        <View 
          className="h-full rounded-full"
          style={{ 
            width: `${(progress.currentLevel / 10) * 100}%`,
            backgroundColor: info.color,
          }}
        />
      </View>
      
      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-slate-400 text-xs">שאלות</Text>
          <Text className="text-slate-800 font-bold">{progress.questionsCompleted}</Text>
        </View>
        <View className="items-center">
          <Text className="text-slate-400 text-xs">דיוק</Text>
          <Text className="text-slate-800 font-bold">{accuracy}%</Text>
        </View>
        <View className="items-center">
          <Text className="text-slate-400 text-xs">כוכבים</Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text className="text-slate-800 font-bold mr-1">{progress.starsEarned}</Text>
          </View>
        </View>
        <View className="items-center">
          <Text className="text-slate-400 text-xs">שיא</Text>
          <Text className="text-slate-800 font-bold">{progress.bestScore}</Text>
        </View>
      </View>
    </View>
  );
}

function AchievementCard({ achievementId, index }: { achievementId: string; index: number }) {
  const userAchievements = useGameStore((state) => state.progress.achievements);
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  const userAchievement = userAchievements.find(a => a.id === achievementId);
  
  if (!achievement) return null;
  
  const isUnlocked = !!userAchievement?.unlockedAt;

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

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      className={`w-[31%] mb-3 ${!isUnlocked ? 'opacity-40' : ''}`}
    >
      <View 
        className={`rounded-2xl p-3 items-center ${isUnlocked ? 'bg-amber-50' : 'bg-slate-100'}`}
        style={{ elevation: isUnlocked ? 2 : 0 }}
      >
        <View 
          className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
            isUnlocked ? 'bg-amber-400' : 'bg-slate-300'
          }`}
        >
          <Ionicons 
            name={iconMap[achievement.icon] || 'star'} 
            size={24} 
            color={isUnlocked ? 'white' : '#94a3b8'} 
          />
        </View>
        <Text className={`text-xs text-center font-medium ${isUnlocked ? 'text-amber-800' : 'text-slate-400'}`}>
          {achievement.nameHe}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ProgressScreen() {
  const progress = useGameStore((state) => state.progress);
  const categories: QuestionCategory[] = ['math', 'verbal', 'visual', 'logic'];
  
  const totalAccuracy = progress.questionsAnswered > 0 
    ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
    : 0;

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
            ההתקדמות שלי 📊
          </Text>
          <Text className="text-slate-500 text-right mt-1">
            עקוב אחרי ההישגים שלך
          </Text>
        </Animated.View>

        {/* Overall Stats */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="mx-6 mb-6"
        >
          <LinearGradient
            colors={['#8b5cf6', '#6d28d9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-5"
            style={{ elevation: 8, shadowColor: '#8b5cf6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
          >
            <Text className="text-white/80 text-right mb-3">סיכום כללי</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-white text-3xl font-bold">{progress.totalStars}</Text>
                <Text className="text-white/70 text-xs">כוכבים</Text>
              </View>
              <View className="w-px bg-white/20 mx-3" />
              <View className="items-center flex-1">
                <Text className="text-white text-3xl font-bold">{progress.totalPoints}</Text>
                <Text className="text-white/70 text-xs">נקודות</Text>
              </View>
              <View className="w-px bg-white/20 mx-3" />
              <View className="items-center flex-1">
                <Text className="text-white text-3xl font-bold">{totalAccuracy}%</Text>
                <Text className="text-white/70 text-xs">דיוק</Text>
              </View>
              <View className="w-px bg-white/20 mx-3" />
              <View className="items-center flex-1">
                <Text className="text-white text-3xl font-bold">{progress.questionsAnswered}</Text>
                <Text className="text-white/70 text-xs">שאלות</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Category Progress */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-slate-800 text-right mb-4">
            לפי קטגוריה
          </Text>
          {categories.map((category, index) => (
            <Animated.View
              key={category}
              entering={FadeInDown.delay(200 + index * 100).springify()}
            >
              <CategoryProgressCard category={category} />
            </Animated.View>
          ))}
        </View>

        {/* Achievements */}
        <View className="px-6">
          <Text className="text-xl font-bold text-slate-800 text-right mb-4">
            הישגים
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {ACHIEVEMENTS.map((achievement, index) => (
              <AchievementCard 
                key={achievement.id} 
                achievementId={achievement.id} 
                index={index}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

