import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, BackHandler, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '@/stores/gameStore';
import { CATEGORY_INFO, LEVEL_CONFIGS } from '@/utils/constants';
import { QuestionCategory } from '@/utils/types';
import { getQuestionsForLevel } from '@/utils/questionLoader';
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

export default function GameScreen() {
  const router = useRouter();
  const { category, level: levelParam } = useLocalSearchParams<{ 
    category: QuestionCategory; 
    level: string;
  }>();
  
  const level = parseInt(levelParam || '1', 10);
  const levelConfig = LEVEL_CONFIGS[level - 1];
  
  const {
    startGame,
    answerQuestion,
    nextQuestion,
    currentQuestions,
    currentQuestionIndex,
    gameState,
  } = useGameStore();

  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; stars: number } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize game
  useEffect(() => {
    if (category && levelConfig) {
      const questions = getQuestionsForLevel(category, level);
      startGame(category, level, questions);
      setQuestionStartTime(Date.now());
    }
  }, [category, level]);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setIsPaused(true);
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // Navigate to results when game is complete
  useEffect(() => {
    if (gameState.isComplete) {
      router.replace('/game/results');
    }
  }, [gameState.isComplete]);

  const handleAnswer = useCallback((selectedAnswer: number) => {
    if (showFeedback) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const result = answerQuestion(selectedAnswer, timeSpent);
    
    setLastResult({ isCorrect: result.isCorrect, stars: result.starsEarned });
    setShowFeedback(true);
    
    // Haptic feedback (safe for web)
    triggerHaptic(result.isCorrect ? 'success' : 'error');

    // Move to next question after delay
    setTimeout(() => {
      setShowFeedback(false);
      setLastResult(null);
      nextQuestion();
      setQuestionStartTime(Date.now());
    }, 1500);
  }, [showFeedback, questionStartTime, answerQuestion, nextQuestion]);

  const handleTimeUp = useCallback(() => {
    if (!showFeedback) {
      handleAnswer(-1); // Wrong answer if time runs out
    }
  }, [showFeedback, handleAnswer]);

  const handleExit = () => {
    router.back();
  };

  if (!category || !CATEGORY_INFO[category] || currentQuestions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <Text className="text-slate-500">טוען...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const info = CATEGORY_INFO[category];

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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Pause Overlay */}
      {isPaused && (
        <View className="absolute inset-0 bg-black/50 z-50 items-center justify-center">
          <View className="bg-white rounded-3xl p-6 mx-6 w-[80%]">
            <Text className="text-xl font-bold text-slate-800 text-center mb-4">
              המשחק מושהה
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
            <View 
              className="px-3 py-1 rounded-full mr-2"
              style={{ backgroundColor: info.color + '20' }}
            >
              <Text style={{ color: info.color }} className="font-bold">
                {info.nameHe}
              </Text>
            </View>
            <Text className="text-slate-500">שלב {level}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="flex-row items-center mb-2">
          <Text className="text-slate-500 text-sm">
            {currentQuestionIndex + 1}/{currentQuestions.length}
          </Text>
          <View className="flex-1 h-2 bg-slate-200 rounded-full mx-3 overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                backgroundColor: info.color,
                width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Score & Timer */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="star" size={18} color="#fbbf24" />
            <Text className="text-slate-700 font-bold mr-1">{gameState.stars}</Text>
          </View>
          
          {currentQuestion && (
            <Timer
              duration={currentQuestion.timeLimit}
              onTimeUp={handleTimeUp}
              isPaused={isPaused || showFeedback}
              color={info.color}
            />
          )}
          
          <View className="flex-row items-center">
            <Ionicons name="trophy" size={18} color="#0ea5e9" />
            <Text className="text-slate-700 font-bold mr-1">{gameState.score}</Text>
          </View>
        </View>
      </View>

      {/* Question Area */}
      <View className="flex-1 px-6">
        <View key={currentQuestionIndex} className="flex-1">
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
