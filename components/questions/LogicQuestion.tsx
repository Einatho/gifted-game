import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LogicQuestion as LogicQuestionType } from '@/utils/types';

type LogicQuestionProps = {
  question: LogicQuestionType;
  onAnswer: (index: number) => void;
  disabled: boolean;
};

export default function LogicQuestion({ question, onAnswer, disabled }: LogicQuestionProps) {
  return (
    <View className="flex-1">
      {/* Question Text */}
      <View className="bg-white rounded-2xl p-5 mb-4" style={{ elevation: 4 }}>
        <View className="flex-row items-center mb-3">
          <Text className="text-emerald-700 font-bold text-right flex-1">שאלה:</Text>
          <Ionicons name="bulb" size={20} color="#10b981" />
        </View>
        <Text className="text-xl font-bold text-slate-800 text-right leading-8">
          {question.questionText}
        </Text>
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
                <Text className="text-lg text-slate-800 text-right flex-1 mr-3 leading-6">
                  {option}
                </Text>
                <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center">
                  <Text className="text-emerald-700 font-bold">
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
