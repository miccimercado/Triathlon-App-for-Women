import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas }, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="consent" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout/[id]" />
        <Stack.Screen name="adapt/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="meal/[id]" />
        <Stack.Screen name="integrations" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="science" />
        <Stack.Screen name="strength" />
        <Stack.Screen name="fueling" />
      </Stack>
    </SafeAreaProvider>
  );
}
