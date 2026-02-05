import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

// Force RTL for Hebrew
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate font loading / app initialization
    const prepare = async () => {
      try {
        // Add any initialization logic here
        // For now, we'll use system fonts and skip custom font loading
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} className="bg-slate-50">
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_left', // RTL animation
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="game/[category]" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        <Stack.Screen 
          name="game/results" 
          options={{ 
            headerShown: false,
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="levels/[category]" 
          options={{ 
            headerShown: false,
            animation: 'slide_from_left',
          }} 
        />
      </Stack>
    </View>
  );
}

