import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '@/stores/gameStore';
import { CATEGORY_INFO, LEVEL_CONFIGS } from '@/utils/constants';
import { QuestionCategory } from '@/utils/types';

function LevelCard({ 
  level, 
  category, 
}: { 
  level: number; 
  category: QuestionCategory; 
}) {
  const router = useRouter();
  const progress = useGameStore((state) => state.progress.categoryProgress[category]);
  const info = CATEGORY_INFO[category];
  const config = LEVEL_CONFIGS[level - 1];
  
  // All levels are always unlocked
  const isUnlocked = true;
  const isCompleted = progress.currentLevel > level;
  const isCurrent = progress.currentLevel === level;

  const handlePress = () => {
    if (isUnlocked) {
      router.push(`/game/${category}?level=${level}`);
    }
  };

  return (
    <View className="w-[30%] mb-4">
      <TouchableOpacity
        onPress={handlePress}
        disabled={!isUnlocked}
        activeOpacity={0.8}
      >
        <View 
          className={`rounded-2xl p-4 items-center ${
            isCompleted 
              ? 'bg-green-100 border-2 border-green-400'
              : isCurrent 
                ? 'bg-white border-2'
                : isUnlocked 
                  ? 'bg-white border border-slate-200'
                  : 'bg-slate-100 border border-slate-200'
          }`}
          style={isCurrent ? { borderColor: info.color } : {}}
        >
          {/* Level Number */}
          <View 
            className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
              isCompleted 
                ? 'bg-green-500'
                : isCurrent 
                  ? ''
                  : isUnlocked 
                    ? 'bg-slate-200'
                    : 'bg-slate-300'
            }`}
            style={isCurrent ? { backgroundColor: info.color } : isUnlocked && !isCompleted ? { backgroundColor: info.color } : {}}
          >
            {isCompleted ? (
              <Ionicons name="checkmark" size={24} color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">{level}</Text>
            )}
          </View>

          {/* Level Info */}
          <Text className="text-sm font-bold text-slate-800">
            שלב {level}
          </Text>
          
          {/* Difficulty */}
          <Text className="text-xs text-slate-500">
            {config.difficulty === 'easy' ? 'קל' : config.difficulty === 'medium' ? 'בינוני' : 'קשה'}
          </Text>

          {/* Questions count */}
          <Text className="text-xs text-slate-400 mt-1">
            {config.questionsCount} שאלות
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function LevelsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: QuestionCategory }>();
  
  if (!category || !CATEGORY_INFO[category]) {
    return null;
  }

  const info = CATEGORY_INFO[category];
  const progress = useGameStore((state) => state.progress.categoryProgress[category]);

  const icons: Record<QuestionCategory, keyof typeof Ionicons.glyphMap> = {
    math: 'calculator',
    verbal: 'book',
    visual: 'shapes',
    logic: 'bulb',
  };

  const gradients: Record<QuestionCategory, [string, string]> = {
    math: ['#3b82f6', '#1d4ed8'],
    verbal: ['#8b5cf6', '#6d28d9'],
    visual: ['#f97316', '#ea580c'],
    logic: ['#10b981', '#059669'],
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <Text className="text-primary-500 mr-1">חזרה</Text>
          <Ionicons name="chevron-forward" size={20} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Header */}
        <View className="mx-6 mb-6">
          <LinearGradient
            colors={gradients[category]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6"
            style={{ elevation: 8, shadowColor: info.color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="bg-white/20 w-16 h-16 rounded-2xl items-center justify-center">
                <Ionicons name={icons[category]} size={32} color="white" />
              </View>
              <View className="flex-1 mr-4">
                <Text className="text-white text-2xl font-bold text-right">
                  {info.nameHe}
                </Text>
                <Text className="text-white/80 text-right mt-1">
                  {info.descriptionHe}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mt-6">
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">{progress.starsEarned}</Text>
                <Text className="text-white/70 text-xs">כוכבים</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">{progress.bestScore}</Text>
                <Text className="text-white/70 text-xs">שיא</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">{progress.correctAnswers}</Text>
                <Text className="text-white/70 text-xs">תשובות נכונות</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Levels Grid */}
        <View className="px-6">
          <Text className="text-xl font-bold text-slate-800 text-right mb-4">
            בחר שלב
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <LevelCard 
                key={level} 
                level={level} 
                category={category}
              />
            ))}
          </View>
        </View>

        {/* Tips */}
        <View className="mx-6 mt-4">
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="bulb" size={20} color="#f59e0b" />
              <Text className="text-amber-800 font-bold text-right flex-1 mr-2">טיפ</Text>
            </View>
            <Text className="text-amber-700 text-right text-sm">
              נסה לענות מהר כדי לקבל 3 כוכבים על כל שאלה!
              ככל שהשלב גבוה יותר, השאלות קשות יותר.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
