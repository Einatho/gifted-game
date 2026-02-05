import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '@/stores/gameStore';
import { CATEGORY_INFO } from '@/utils/constants';
import { QuestionCategory } from '@/utils/types';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type CategoryCardProps = {
  category: QuestionCategory;
  index: number;
};

function CategoryCard({ category, index }: CategoryCardProps) {
  const router = useRouter();
  const info = CATEGORY_INFO[category];
  const progress = useGameStore((state) => state.progress.categoryProgress[category]);
  
  const gradients: Record<QuestionCategory, [string, string]> = {
    math: ['#3b82f6', '#1d4ed8'],
    verbal: ['#8b5cf6', '#6d28d9'],
    visual: ['#f97316', '#ea580c'],
    logic: ['#10b981', '#059669'],
  };

  const icons: Record<QuestionCategory, keyof typeof Ionicons.glyphMap> = {
    math: 'calculator',
    verbal: 'book',
    visual: 'shapes',
    logic: 'bulb',
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="w-[48%] mb-4"
    >
      <TouchableOpacity
        onPress={() => router.push(`/levels/${category}`)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradients[category]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl p-5 min-h-[180px]"
          style={{ elevation: 8, shadowColor: info.color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
        >
          <View className="flex-1">
            <View className="bg-white/20 w-14 h-14 rounded-2xl items-center justify-center mb-3">
              <Ionicons name={icons[category]} size={28} color="white" />
            </View>
            <Text className="text-white text-lg font-bold mb-1">{info.nameHe}</Text>
            <Text className="text-white/80 text-xs mb-3">{info.descriptionHe}</Text>
            
            <View className="flex-row items-center mt-auto">
              <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1">
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text className="text-white text-xs mr-1">{progress.starsEarned}</Text>
              </View>
              <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1 mr-2">
                <Text className="text-white text-xs">שלב {progress.currentLevel}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const progress = useGameStore((state) => state.progress);
  const categories: QuestionCategory[] = ['math', 'verbal', 'visual', 'logic'];

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
            מבחן מחוננים 🌟
          </Text>
          <Text className="text-slate-500 text-right mt-1">
            בוא נתאמן ונצליח!
          </Text>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View
          entering={FadeInDown.delay(50).springify()}
          className="mx-6 mb-6"
        >
          <LinearGradient
            colors={['#0ea5e9', '#0284c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-5"
            style={{ elevation: 8, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
          >
            <View className="flex-row justify-between">
              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="star" size={24} color="#fbbf24" />
                </View>
                <Text className="text-white text-2xl font-bold">{progress.totalStars}</Text>
                <Text className="text-white/70 text-xs">כוכבים</Text>
              </View>
              
              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="trophy" size={24} color="#fbbf24" />
                </View>
                <Text className="text-white text-2xl font-bold">{progress.totalPoints}</Text>
                <Text className="text-white/70 text-xs">נקודות</Text>
              </View>
              
              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                </View>
                <Text className="text-white text-2xl font-bold">
                  {progress.questionsAnswered > 0 
                    ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
                    : 0}%
                </Text>
                <Text className="text-white/70 text-xs">דיוק</Text>
              </View>
              
              <View className="items-center">
                <View className="bg-white/20 w-12 h-12 rounded-xl items-center justify-center mb-2">
                  <Ionicons name="flame" size={24} color="#f97316" />
                </View>
                <Text className="text-white text-2xl font-bold">{progress.dailyChallengeStreak}</Text>
                <Text className="text-white/70 text-xs">רצף</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories Section */}
        <View className="px-6">
          <Text className="text-xl font-bold text-slate-800 text-right mb-4">
            קטגוריות
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category, index) => (
              <CategoryCard key={category} category={category} index={index} />
            ))}
          </View>
        </View>

        {/* Quick Tips */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="mx-6 mt-4"
        >
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="bulb" size={20} color="#f59e0b" />
              <Text className="text-amber-800 font-bold text-right flex-1 mr-2">טיפ להצלחה</Text>
            </View>
            <Text className="text-amber-700 text-right text-sm">
              תרגול יומי של 15 דקות יעזור לך להשתפר משמעותית! 
              נסה לסיים לפחות שלב אחד בכל יום.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

