import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '@/stores/gameStore';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function DailyChallengeScreen() {
  const router = useRouter();
  const progress = useGameStore((state) => state.progress);
  const updateDailyStreak = useGameStore((state) => state.updateDailyStreak);

  const today = new Date().toDateString();
  const hasPlayedToday = progress.lastPlayedDate === today;

  const handleStartChallenge = () => {
    updateDailyStreak();
    router.push('/game/daily');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView 
        className="flex-1 px-6" 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.springify()}
          className="pt-4 pb-6"
        >
          <Text className="text-3xl font-bold text-slate-800 text-right">
            אתגר יומי ⚡
          </Text>
          <Text className="text-slate-500 text-right mt-1">
            שאלות מכל הקטגוריות
          </Text>
        </Animated.View>

        {/* Streak Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <LinearGradient
            colors={['#f97316', '#ea580c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 mb-6"
            style={{ elevation: 8, shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="bg-white/20 w-20 h-20 rounded-2xl items-center justify-center">
                <Ionicons name="flame" size={40} color="white" />
              </View>
              <View className="flex-1 mr-4">
                <Text className="text-white/80 text-right">רצף יומי</Text>
                <Text className="text-white text-5xl font-bold text-right">
                  {progress.dailyChallengeStreak}
                </Text>
                <Text className="text-white/80 text-right">ימים רצופים</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Weekly Progress */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="bg-white rounded-3xl p-5 mb-6"
          style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
        >
          <Text className="text-lg font-bold text-slate-800 text-right mb-4">
            השבוע שלך
          </Text>
          <View className="flex-row justify-between">
            {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day, index) => {
              const isCompleted = index < progress.dailyChallengeStreak % 7;
              const isToday = index === new Date().getDay();
              return (
                <View key={day} className="items-center">
                  <View 
                    className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${
                      isCompleted 
                        ? 'bg-green-500' 
                        : isToday 
                          ? 'bg-primary-500' 
                          : 'bg-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={20} color="white" />
                    ) : (
                      <Text className={`text-sm ${isToday ? 'text-white' : 'text-slate-400'}`}>
                        {day}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Challenge Info */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          className="bg-white rounded-3xl p-5 mb-6"
          style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
        >
          <Text className="text-lg font-bold text-slate-800 text-right mb-4">
            מה כולל האתגר?
          </Text>
          <View className="space-y-3">
            {[
              { icon: 'calculator', text: '3 שאלות מתמטיות', color: '#3b82f6' },
              { icon: 'book', text: '3 שאלות מילוליות', color: '#8b5cf6' },
              { icon: 'shapes', text: '2 שאלות חזותיות', color: '#f97316' },
              { icon: 'bulb', text: '2 שאלות היגיון', color: '#10b981' },
            ].map((item, index) => (
              <View key={index} className="flex-row items-center justify-end mb-2">
                <Text className="text-slate-600 text-right mr-3">{item.text}</Text>
                <View 
                  className="w-8 h-8 rounded-lg items-center justify-center"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Rewards Info */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6"
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name="gift" size={20} color="#f59e0b" />
            <Text className="text-amber-800 font-bold text-right flex-1 mr-2">פרסים</Text>
          </View>
          <Text className="text-amber-700 text-right text-sm">
            השלם את האתגר וקבל עד 200 נקודות ו-10 כוכבים!
            שמור על רצף של 7 ימים לפרס מיוחד.
          </Text>
        </Animated.View>

        {/* Start Button */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <TouchableOpacity
            onPress={handleStartChallenge}
            disabled={hasPlayedToday}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={hasPlayedToday ? ['#94a3b8', '#64748b'] : ['#0ea5e9', '#0284c7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-5"
              style={{ elevation: 8, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons 
                  name={hasPlayedToday ? 'checkmark-circle' : 'play'} 
                  size={28} 
                  color="white" 
                />
                <Text className="text-white text-xl font-bold mr-3">
                  {hasPlayedToday ? 'הושלם להיום!' : 'התחל אתגר'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

