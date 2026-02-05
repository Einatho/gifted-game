import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VerbalQuestion as VerbalQuestionType } from '@/utils/types';

type VerbalQuestionProps = {
  question: VerbalQuestionType;
  onAnswer: (index: number) => void;
  disabled: boolean;
};

export default function VerbalQuestion({ question, onAnswer, disabled }: VerbalQuestionProps) {
  return (
    <View className="flex-1">
      {/* Question Text */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-slate-800 text-right leading-8">
          {question.questionText}
        </Text>
      </View>

      {/* Word Pair Display */}
      <View className="bg-white rounded-2xl p-5 mb-6" style={{ elevation: 4 }}>
        <View className="flex-row items-center justify-center">
          <View className="bg-purple-100 rounded-xl px-5 py-3">
            <Text className="text-purple-700 text-xl font-bold">{question.pair[1]}</Text>
          </View>
          
          <View className="mx-4">
            <Ionicons name="arrow-back" size={24} color="#8b5cf6" />
          </View>
          
          <View className="bg-purple-100 rounded-xl px-5 py-3">
            <Text className="text-purple-700 text-xl font-bold">{question.pair[0]}</Text>
          </View>
        </View>

        <View className="items-center my-4">
          <Text className="text-slate-400 text-lg">כמו</Text>
        </View>

        <View className="flex-row items-center justify-center">
          <View className="bg-amber-100 rounded-xl px-5 py-3 border-2 border-amber-400 border-dashed">
            <Text className="text-amber-700 text-xl font-bold">?</Text>
          </View>
          
          <View className="mx-4">
            <Ionicons name="arrow-back" size={24} color="#f59e0b" />
          </View>
          
          <View className="bg-amber-100 rounded-xl px-5 py-3 border-2 border-amber-400 border-dashed">
            <Text className="text-amber-700 text-xl font-bold">?</Text>
          </View>
        </View>
      </View>

      {/* Options */}
      <View>
        {question.options.map((option, index) => (
          <View key={index} className="mb-3">
            <TouchableOpacity
              onPress={() => onAnswer(index)}
              disabled={disabled}
              activeOpacity={0.7}
              className={`bg-white rounded-2xl p-4 border-2 border-slate-200 ${disabled ? 'opacity-70' : ''}`}
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
            >
              <View className="flex-row items-center justify-end">
                <View className="flex-row items-center flex-1 justify-end">
                  <Text className="text-lg text-slate-800">{option[1]}</Text>
                  <Text className="text-slate-400 mx-2">:</Text>
                  <Text className="text-lg text-slate-800">{option[0]}</Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                  <Text className="text-purple-700 font-bold">
                    {String.fromCharCode(1488 + index)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
