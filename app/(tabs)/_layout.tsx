import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  label: string;
};

function TabIcon({ name, color, focused, label }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-2">
      <Ionicons name={name} size={24} color={color} />
      <Text
        className={`text-xs mt-1 ${focused ? 'font-bold' : 'font-normal'}`}
        style={{ color }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: 80,
          paddingBottom: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'בית',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} label="בית" />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'אתגר יומי',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="flash" color={color} focused={focused} label="אתגר יומי" />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'התקדמות',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="stats-chart" color={color} focused={focused} label="התקדמות" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'הגדרות',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings" color={color} focused={focused} label="הגדרות" />
          ),
        }}
      />
    </Tabs>
  );
}

