import { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '@/stores/gameStore';

// Safe haptics helper for web compatibility
const triggerHaptic = async () => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (e) {
    // Haptics not available
  }
};
import { CATEGORY_INFO } from '@/utils/constants';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

function StarDisplay({ count, total }: { count: number; total: number }) {
  return (
    <View className="flex-row justify-center">
      {[...Array(total)].map((_, i) => (
        <Animated.View
          key={i}
          entering={ZoomIn.delay(500 + i * 200).springify()}
        >
          <Ionicons 
            name={i < count ? 'star' : 'star-outline'} 
            size={40} 
            color={i < count ? '#fbbf24' : '#e2e8f0'}
            style={{ marginHorizontal: 4 }}
          />
        </Animated.View>
      ))}
    </View>
  );
}

export default function ResultsScreen() {
  const router = useRouter();
  const { 
    gameState, 
    currentCategory, 
    currentLevel, 
    endGame, 
    resetGame,
    progress,
  } = useGameStore();

  const results = endGame();
  const info = currentCategory ? CATEGORY_INFO[currentCategory] : null;

  const pulseScale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  useEffect(() => {
    // Celebration haptic (safe for web)
    triggerHaptic();
    
    // Pulse animation for score
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      3
    );
  }, []);

  const handlePlayAgain = () => {
    if (currentCategory) {
      resetGame();
      router.replace(`/game/${currentCategory}?level=${currentLevel}`);
    }
  };

  const handleNextLevel = () => {
    if (currentCategory && currentLevel < 10) {
      const nextLevel = currentLevel + 1;
      const categoryProgress = progress.categoryProgress[currentCategory];
      
      if (categoryProgress.unlockedLevels.includes(nextLevel)) {
        resetGame();
        router.replace(`/game/${currentCategory}?level=${nextLevel}`);
      } else {
        // Level not unlocked, go to levels screen
        resetGame();
        router.replace(`/levels/${currentCategory}`);
      }
    }
  };

  const handleHome = () => {
    resetGame();
    router.replace('/');
  };

  const accuracyPercentage = Math.round(results.accuracy * 100);
  const isGoodPerformance = accuracyPercentage >= 70;

  // Calculate star rating (1-3 based on performance)
  const starRating = accuracyPercentage >= 90 ? 3 : accuracyPercentage >= 70 ? 2 : accuracyPercentage >= 50 ? 1 : 0;

  const gradientColors: [string, string] = isGoodPerformance 
    ? ['#10b981', '#059669']
    : ['#f97316', '#ea580c'];

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
          className="px-6 pt-6 pb-4 items-center"
        >
          <Text className="text-3xl font-bold text-slate-800">
            {isGoodPerformance ? '🎉 כל הכבוד!' : '💪 ניסיון טוב!'}
          </Text>
          <Text className="text-slate-500 mt-1">
            {info?.nameHe} - שלב {currentLevel}
          </Text>
        </Animated.View>

        {/* Stars */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          className="py-6"
        >
          <StarDisplay count={starRating} total={3} />
        </Animated.View>

        {/* Main Score Card */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="mx-6 mb-6"
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6"
            style={{ elevation: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
          >
            <Animated.View style={animatedStyle} className="items-center">
              <Text className="text-white/80 text-lg">ציון</Text>
              <Text className="text-white text-6xl font-bold">{results.totalPoints}</Text>
              <Text className="text-white/80">נקודות</Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Grid */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between">
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              className="bg-white rounded-2xl p-4 items-center flex-1 ml-2"
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
            >
              <View className="w-12 h-12 rounded-full bg-amber-100 items-center justify-center mb-2">
                <Ionicons name="star" size={24} color="#f59e0b" />
              </View>
              <Text className="text-2xl font-bold text-slate-800">{results.totalStars}</Text>
              <Text className="text-slate-500 text-sm">כוכבים</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              className="bg-white rounded-2xl p-4 items-center flex-1 mx-2"
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
            >
              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-2">
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              </View>
              <Text className="text-2xl font-bold text-slate-800">{accuracyPercentage}%</Text>
              <Text className="text-slate-500 text-sm">דיוק</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(600).springify()}
              className="bg-white rounded-2xl p-4 items-center flex-1 mr-2"
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
            >
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
                <Ionicons name="help-circle" size={24} color="#3b82f6" />
              </View>
              <Text className="text-2xl font-bold text-slate-800">
                {gameState.answers.filter(a => a.isCorrect).length}/{gameState.answers.length}
              </Text>
              <Text className="text-slate-500 text-sm">תשובות</Text>
            </Animated.View>
          </View>
        </View>

        {/* Performance Summary */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          className="mx-6 mb-6"
        >
          <View 
            className={`rounded-2xl p-4 ${isGoodPerformance ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}
          >
            <View className="flex-row items-center mb-2">
              <Ionicons 
                name={isGoodPerformance ? 'trophy' : 'refresh'} 
                size={20} 
                color={isGoodPerformance ? '#22c55e' : '#f59e0b'} 
              />
              <Text 
                className={`font-bold text-right flex-1 mr-2 ${isGoodPerformance ? 'text-green-800' : 'text-amber-800'}`}
              >
                {isGoodPerformance ? 'ביצוע מצוין!' : 'נסה שוב'}
              </Text>
            </View>
            <Text className={`text-right text-sm ${isGoodPerformance ? 'text-green-700' : 'text-amber-700'}`}>
              {isGoodPerformance 
                ? 'המשך כך! אתה בדרך הנכונה להצלחה במבחן המחוננים.'
                : 'תרגול עושה מושלם! נסה שוב כדי לשפר את הציון.'}
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View className="px-6">
          {/* Next Level / Play Again */}
          {isGoodPerformance && currentLevel < 10 ? (
            <Animated.View entering={FadeInDown.delay(800).springify()}>
              <TouchableOpacity
                onPress={handleNextLevel}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#0ea5e9', '#0284c7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl p-4 mb-3"
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="arrow-back" size={24} color="white" />
                    <Text className="text-white text-lg font-bold mr-2">שלב הבא</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(900).springify()}>
            <TouchableOpacity
              onPress={handlePlayAgain}
              activeOpacity={0.8}
              className="bg-white border-2 border-primary-500 rounded-2xl p-4 mb-3"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="refresh" size={24} color="#0ea5e9" />
                <Text className="text-primary-500 text-lg font-bold mr-2">שחק שוב</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1000).springify()}>
            <TouchableOpacity
              onPress={handleHome}
              activeOpacity={0.8}
              className="bg-slate-200 rounded-2xl p-4"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="home" size={24} color="#64748b" />
                <Text className="text-slate-600 text-lg font-bold mr-2">חזרה הביתה</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

