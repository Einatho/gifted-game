import { View, Text, TouchableOpacity } from 'react-native';
import { MathQuestion as MathQuestionType } from '@/utils/types';
import Animated, { FadeInDown } from 'react-native-reanimated';

type MathQuestionProps = {
  question: MathQuestionType;
  onAnswer: (index: number) => void;
  disabled: boolean;
};

export default function MathQuestion({ question, onAnswer, disabled }: MathQuestionProps) {
  const renderSequence = () => {
    if (question.type === 'sequence' && question.sequence) {
      return (
        <View className="flex-row flex-wrap justify-center items-center mb-6 bg-white rounded-2xl p-4">
          {question.sequence.map((num, index) => (
            <View key={index} className="flex-row items-center">
              <View className="bg-primary-100 rounded-xl px-4 py-3 mx-1 my-1">
                <Text className="text-primary-700 text-xl font-bold">{num}</Text>
              </View>
              {index < question.sequence!.length - 1 && (
                <Text className="text-slate-400 text-lg mx-1">،</Text>
              )}
            </View>
          ))}
          <View className="bg-amber-100 rounded-xl px-4 py-3 mx-1 my-1 border-2 border-amber-400 border-dashed">
            <Text className="text-amber-700 text-xl font-bold">?</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View className="flex-1">
      {/* Question Text */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-slate-800 text-right leading-8">
          {question.questionText}
        </Text>
      </View>

      {/* Sequence Display */}
      {renderSequence()}

      {/* Options */}
      <View className="space-y-3">
        {question.options.map((option, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(index * 100).springify()}
          >
            <TouchableOpacity
              onPress={() => onAnswer(index)}
              disabled={disabled}
              activeOpacity={0.7}
              className={`bg-white rounded-2xl p-4 border-2 border-slate-200 ${disabled ? 'opacity-70' : ''}`}
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
            >
              <View className="flex-row items-center justify-end">
                <Text className="text-lg text-slate-800 text-right flex-1 mr-3">
                  {option}
                </Text>
                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
                  <Text className="text-slate-600 font-bold">
                    {String.fromCharCode(1488 + index)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

