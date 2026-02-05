import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '@/stores/gameStore';
import { CATEGORY_INFO } from '@/utils/constants';
import { Question } from '@/utils/types';
import { getRealTestQuestions } from '@/utils/questionLoader';
import MathQuestion from '@/components/questions/MathQuestion';
import VerbalQuestion from '@/components/questions/VerbalQuestion';
import VisualQuestion from '@/components/questions/VisualQuestion';
import LogicQuestion from '@/components/questions/LogicQuestion';
import Timer from '@/components/game/Timer';

// Safe haptics helper for web compatibility
const triggerHaptic = async (type: 'success' | 'error') => {
  if (Platform.OS === 'web') return;
  try {
    if (type === 'success') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  } catch (e) {
    // Haptics not available
  }
};

export default function RealTestScreen() {
  const router = useRouter();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [answers, setAnswers] = useState<{ isCorrect: boolean; timeSpent: number }[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; stars: number } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize test
  useEffect(() => {
    const testQuestions = getRealTestQuestions();
    setQuestions(testQuestions);
    setQuestionStartTime(Date.now());
  }, []);

  const currentQuestion = questions[currentIndex];

  const calculateStars = (timeSpent: number, timeLimit: number): number => {
    const timeRatio = 1 - (timeSpent / timeLimit);
    if (timeRatio >= 0.8) return 3;
    if (timeRatio >= 0.5) return 2;
    return 1;
  };

  const handleAnswer = useCallback((selectedAnswer: number) => {
    if (showFeedback || !currentQuestion) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const earnedStars = isCorrect ? calculateStars(timeSpent, currentQuestion.timeLimit) : 0;
    const earnedPoints = isCorrect ? currentQuestion.points : 0;
    
    setLastResult({ isCorrect, stars: earnedStars });
    setShowFeedback(true);
    setAnswers(prev => [...prev, { isCorrect, timeSpent }]);
    
    if (isCorrect) {
      setScore(prev => prev + earnedPoints);
      setStars(prev => prev + earnedStars);
    }
    
    // Haptic feedback (safe for web)
    triggerHaptic(isCorrect ? 'success' : 'error');

    // Move to next question after delay
    setTimeout(() => {
      setShowFeedback(false);
      setLastResult(null);
      
      if (currentIndex + 1 >= questions.length) {
        setIsComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setQuestionStartTime(Date.now());
      }
    }, 1500);
  }, [showFeedback, questionStartTime, currentQuestion, currentIndex, questions.length]);

  const handleTimeUp = useCallback(() => {
    if (!showFeedback) {
      handleAnswer(-1); // Wrong answer if time runs out
    }
  }, [showFeedback, handleAnswer]);

  const handleExit = () => {
    router.back();
  };

  const handleFinish = () => {
    router.replace('/');
  };

  // Render question component based on category
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const commonProps = {
      question: currentQuestion,
      onAnswer: handleAnswer,
      disabled: showFeedback,
    };

    switch (currentQuestion.category) {
      case 'math':
        return <MathQuestion {...commonProps} question={currentQuestion} />;
      case 'verbal':
        return <VerbalQuestion {...commonProps} question={currentQuestion} />;
      case 'visual':
        return <VisualQuestion {...commonProps} question={currentQuestion} />;
      case 'logic':
        return <LogicQuestion {...commonProps} question={currentQuestion} />;
      default:
        return null;
    }
  };

  // Results screen
  if (isComplete) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / answers.length) * 100);
    const isGoodPerformance = accuracy >= 70;

    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 px-6 pt-6">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-slate-800">
              {isGoodPerformance ? '🎉 מעולה!' : '💪 ניסיון טוב!'}
            </Text>
            <Text className="text-slate-500 mt-1">סיימת את מבחן הסימולציה</Text>
          </View>

          {/* Score Card */}
          <View 
            className={`rounded-3xl p-6 mb-6 ${isGoodPerformance ? 'bg-green-500' : 'bg-orange-500'}`}
          >
            <View className="items-center">
              <Text className="text-white/80 text-lg">ציון סופי</Text>
              <Text className="text-white text-6xl font-bold">{score}</Text>
              <Text className="text-white/80">נקודות</Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mb-6">
            <View className="bg-white rounded-2xl p-4 items-center flex-1 ml-2" style={{ elevation: 2 }}>
              <Ionicons name="star" size={24} color="#f59e0b" />
              <Text className="text-2xl font-bold text-slate-800 mt-2">{stars}</Text>
              <Text className="text-slate-500 text-sm">כוכבים</Text>
            </View>
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mx-2" style={{ elevation: 2 }}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text className="text-2xl font-bold text-slate-800 mt-2">{accuracy}%</Text>
              <Text className="text-slate-500 text-sm">דיוק</Text>
            </View>
            <View className="bg-white rounded-2xl p-4 items-center flex-1 mr-2" style={{ elevation: 2 }}>
              <Ionicons name="help-circle" size={24} color="#3b82f6" />
              <Text className="text-2xl font-bold text-slate-800 mt-2">{correctCount}/{answers.length}</Text>
              <Text className="text-slate-500 text-sm">תשובות</Text>
            </View>
          </View>

          {/* Category Breakdown */}
          <View className="bg-white rounded-2xl p-4 mb-6" style={{ elevation: 2 }}>
            <Text className="text-lg font-bold text-slate-800 text-right mb-3">פירוט לפי קטגוריה</Text>
            {(['math', 'verbal', 'visual', 'logic'] as const).map(cat => {
              const catQuestions = questions.filter(q => q.category === cat);
              const catCorrect = catQuestions.filter((q, i) => {
                const idx = questions.indexOf(q);
                return answers[idx]?.isCorrect;
              }).length;
              const info = CATEGORY_INFO[cat];
              return (
                <View key={cat} className="flex-row items-center justify-between py-2 border-b border-slate-100">
                  <Text className="text-slate-600">{catCorrect}/{catQuestions.length}</Text>
                  <Text className="text-slate-800 font-medium">{info.nameHe}</Text>
                </View>
              );
            })}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleFinish}
            className="bg-primary-500 rounded-2xl p-4"
          >
            <Text className="text-white text-lg font-bold text-center">חזרה לדף הבית</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500">טוען מבחן...</Text>
      </SafeAreaView>
    );
  }

  const categoryInfo = currentQuestion ? CATEGORY_INFO[currentQuestion.category] : null;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Pause Overlay */}
      {isPaused && (
        <View className="absolute inset-0 bg-black/50 z-50 items-center justify-center">
          <View className="bg-white rounded-3xl p-6 mx-6 w-[80%]">
            <Text className="text-xl font-bold text-slate-800 text-center mb-4">
              המבחן מושהה
            </Text>
            <TouchableOpacity
              onPress={() => setIsPaused(false)}
              className="bg-primary-500 rounded-xl py-3 mb-3"
            >
              <Text className="text-white text-center font-bold">המשך</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleExit}
              className="bg-slate-200 rounded-xl py-3"
            >
              <Text className="text-slate-600 text-center font-bold">יציאה</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Header */}
      <View className="px-6 pt-2 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => setIsPaused(true)}>
            <Ionicons name="pause-circle" size={32} color="#94a3b8" />
          </TouchableOpacity>
          
          <View className="flex-row items-center">
            <View className="bg-pink-100 px-3 py-1 rounded-full mr-2">
              <Text className="text-pink-600 font-bold">מבחן סימולציה</Text>
            </View>
            {categoryInfo && (
              <View 
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: categoryInfo.color + '20' }}
              >
                <Text style={{ color: categoryInfo.color }} className="font-bold text-sm">
                  {categoryInfo.nameHe}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        <View className="flex-row items-center mb-2">
          <Text className="text-slate-500 text-sm">
            {currentIndex + 1}/{questions.length}
          </Text>
          <View className="flex-1 h-2 bg-slate-200 rounded-full mx-3 overflow-hidden">
            <View 
              className="h-full rounded-full bg-pink-500"
              style={{ 
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Score & Timer */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="star" size={18} color="#fbbf24" />
            <Text className="text-slate-700 font-bold mr-1">{stars}</Text>
          </View>
          
          {currentQuestion && (
            <Timer
              duration={currentQuestion.timeLimit}
              onTimeUp={handleTimeUp}
              isPaused={isPaused || showFeedback}
              color="#ec4899"
            />
          )}
          
          <View className="flex-row items-center">
            <Ionicons name="trophy" size={18} color="#0ea5e9" />
            <Text className="text-slate-700 font-bold mr-1">{score}</Text>
          </View>
        </View>
      </View>

      {/* Question Area */}
      <View className="flex-1 px-6">
        <View key={currentIndex} className="flex-1">
          {renderQuestion()}
        </View>
      </View>

      {/* Feedback Overlay */}
      {showFeedback && lastResult && (
        <View 
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <View 
            className={`w-32 h-32 rounded-full items-center justify-center ${
              lastResult.isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <Ionicons 
              name={lastResult.isCorrect ? 'checkmark' : 'close'} 
              size={60} 
              color="white" 
            />
            {lastResult.isCorrect && lastResult.stars > 0 && (
              <View className="flex-row mt-2">
                {[...Array(lastResult.stars)].map((_, i) => (
                  <Ionicons key={i} name="star" size={20} color="#fbbf24" />
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

