import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Field, Button, IconButton } from '@/components/ui';
import { appConfig } from '@/config/app';
import { colors, spacing, type } from '@/theme/tokens';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!email.includes('@') || password.length < 8) return Alert.alert('Check your details', 'Enter a valid email and a password of at least 8 characters.');
    setLoading(true);
    if (supabase && isSupabaseConfigured) {
      const result = mode === 'signup' ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (result.error) return Alert.alert('Could not continue', result.error.message);
    } else setTimeout(() => setLoading(false), 250);
    router.push('/consent');
  };
  return (
    <Screen>
      <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
      <Header eyebrow={appConfig.name} title={mode === 'signup' ? 'Let’s build your plan' : 'Welcome back'} subtitle={mode === 'signup' ? 'Start with an account. Your health data stays permission-based and private.' : 'Sign in to continue your training.'} />
      <View style={styles.tabs}>
        {(['signup', 'login'] as const).map((item) => <Pressable key={item} onPress={() => setMode(item)} style={[styles.tab, mode === item && styles.activeTab]}><Text style={[styles.tabText, mode === item && styles.activeText]}>{item === 'signup' ? 'Sign up' : 'Log in'}</Text></Pressable>)}
      </View>
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 8 characters" />
      <Button title={mode === 'signup' ? 'Continue' : 'Log in'} onPress={submit} loading={loading} />
      {!isSupabaseConfigured ? <View style={styles.demoNote}><Ionicons name="flask-outline" size={18} color={colors.forest} /><Text style={styles.note}>Local demo auth is active. Add Supabase environment variables for live accounts.</Text></View> : null}
      <Text style={styles.legal}>By continuing, you agree to the Terms and acknowledge the Privacy Notice. You’ll review health-data consent next.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', backgroundColor: colors.cream, borderRadius: 14, padding: 4 }, tab: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 11 }, activeTab: { backgroundColor: colors.white }, tabText: { ...type.small, color: colors.inkMuted }, activeText: { color: colors.ink, fontWeight: '800' }, demoNote: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', backgroundColor: colors.sagePale, padding: spacing.md, borderRadius: 14 }, note: { ...type.small, color: colors.inkMuted, flex: 1 }, legal: { ...type.small, color: colors.inkMuted, textAlign: 'center' },
});

