import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LogicQuestion as LogicQuestionType } from '@/utils/types';
import Animated, { FadeInDown } from 'react-native-reanimated';

type LogicQuestionProps = {
  question: LogicQuestionType;
  onAnswer: (index: number) => void;
  disabled: boolean;
};

export default function LogicQuestion({ question, onAnswer, disabled }: LogicQuestionProps) {
  return (
    <View className="flex-1">
      {/* Question Text */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-slate-800 text-right leading-8">
          {question.questionText}
        </Text>
      </View>

      {/* Statements Display */}
      <View className="bg-white rounded-2xl p-5 mb-6" style={{ elevation: 4 }}>
        <View className="flex-row items-center mb-3">
          <Text className="text-emerald-700 font-bold text-right flex-1">נתונים:</Text>
          <Ionicons name="information-circle" size={20} color="#10b981" />
        </View>
        
        {question.statements.map((statement, index) => (
          <View 
            key={index} 
            className="bg-emerald-50 rounded-xl p-3 mb-2 flex-row items-start"
          >
            <Text className="text-emerald-800 text-right flex-1 leading-6">
              {statement}
            </Text>
            <View className="w-6 h-6 rounded-full bg-emerald-200 items-center justify-center mr-2">
              <Text className="text-emerald-700 text-xs font-bold">{index + 1}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Question Prompt */}
      <View className="bg-amber-50 rounded-xl p-3 mb-4 flex-row items-center">
        <Ionicons name="help-circle" size={20} color="#f59e0b" />
        <Text className="text-amber-800 font-medium text-right flex-1 mr-2">
          מה נכון לומר?
        </Text>
      </View>

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
                <Text className="text-lg text-slate-800 text-right flex-1 mr-3 leading-6">
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

