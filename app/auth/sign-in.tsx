import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function SignInScreen() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignIn = async () => {
    setError('');
    const result = await signIn(name);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error || 'משהו השתבש');
    }
  };

  return (
    <LinearGradient
      colors={['#0ea5e9', '#3b82f6', '#6366f1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-8"
        >
          <View className="items-center mb-10">
            <View className="bg-white/20 w-24 h-24 rounded-3xl items-center justify-center mb-6">
              <Text className="text-5xl">🌟</Text>
            </View>
            <Text className="text-white text-4xl font-bold text-center mb-2">
              מבחן מחוננים
            </Text>
            <Text className="text-white/80 text-lg text-center">
              !בוא נתחיל לתרגל
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 shadow-lg">
            <Text className="text-slate-800 text-xl font-bold text-right mb-2">
              ?מה השם שלך
            </Text>
            <Text className="text-slate-500 text-sm text-right mb-5">
              הכנס את השם שלך כדי להתחיל
            </Text>

            <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3 mb-4">
              <Ionicons name="person" size={22} color="#94a3b8" />
              <TextInput
                className="flex-1 text-right text-lg text-slate-800 mr-3"
                placeholder="השם שלי..."
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                autoFocus
                returnKeyType="go"
                onSubmitEditing={handleSignIn}
                editable={!isLoading}
              />
            </View>

            {error ? (
              <View className="flex-row items-center justify-end mb-4">
                <Text className="text-red-500 text-sm mr-1">{error}</Text>
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isLoading || !name.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={name.trim() ? ['#3b82f6', '#2563eb'] : ['#cbd5e1', '#94a3b8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl py-4 items-center"
              >
                {isLoading ? (
                  <Text className="text-white text-lg font-bold">...רגע</Text>
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="arrow-back" size={20} color="white" />
                    <Text className="text-white text-lg font-bold mr-2">
                      !יאללה, בוא נתחיל
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View className="items-center mt-8">
            <Text className="text-white/60 text-xs text-center">
              ההתקדמות שלך נשמרת אוטומטית ☁️
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
