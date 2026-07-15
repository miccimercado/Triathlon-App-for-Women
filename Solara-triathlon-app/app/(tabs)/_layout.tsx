import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { colors, type } from '@/theme/tokens';

const iconMap = { index: ['home-outline', 'home'], plan: ['calendar-outline', 'calendar'], nutrition: ['restaurant-outline', 'restaurant'], checkin: ['pulse-outline', 'pulse'], profile: ['person-outline', 'person'] } as const;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.forestDeep,
      tabBarInactiveTintColor: colors.inkMuted,
      tabBarStyle: styles.bar,
      tabBarLabelStyle: styles.label,
      tabBarIcon: ({ focused, color, size }) => {
        const pair = iconMap[route.name as keyof typeof iconMap] || iconMap.index;
        return <Ionicons name={focused ? pair[1] : pair[0]} size={size} color={color} />;
      },
    })}>
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan' }} />
      <Tabs.Screen name="nutrition" options={{ title: 'Nutrition' }} />
      <Tabs.Screen name="checkin" options={{ title: 'Check-in' }} />
      <Tabs.Screen name="profile" options={{ title: 'You' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({ bar: { position: 'absolute', height: 84, paddingTop: 9, paddingBottom: 18, backgroundColor: '#FFFFFFF7', borderTopColor: colors.border }, label: { ...type.small, fontSize: 11 } });

