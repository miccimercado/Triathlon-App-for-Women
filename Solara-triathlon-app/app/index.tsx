import { useEffect } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { appConfig } from '@/config/app';
import { colors, radius, spacing, type } from '@/theme/tokens';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store/useAppStore';

export default function WelcomeScreen() {
  const { onboardingComplete, useDemo } = useAppStore();
  useEffect(() => { if (onboardingComplete) router.replace('/(tabs)'); }, [onboardingComplete]);
  return (
    <LinearGradient colors={[colors.canvas, colors.sagePale, colors.peachPale]} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.brand}><View style={styles.mark}><Ionicons name="sunny-outline" size={25} color={colors.forestDeep} /></View><Text style={styles.brandName}>{appConfig.name}</Text></View>
        <View style={styles.visual}>
          <View style={styles.orbitOuter} />
          <View style={styles.orbitMiddle} />
          <View style={styles.orbitInner}><Ionicons name="heart" size={36} color={colors.peach} /></View>
          <View style={[styles.sportDot, styles.swim]}><Ionicons name="water" size={20} color={colors.white} /></View>
          <View style={[styles.sportDot, styles.bike]}><Ionicons name="bicycle" size={21} color={colors.white} /></View>
          <View style={[styles.sportDot, styles.run]}><Ionicons name="walk" size={21} color={colors.white} /></View>
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>YOUR 70.3, YOUR WHOLE LIFE</Text>
          <Text style={styles.title}>Train strong.{`\n`}Fuel fully.{`\n`}Live well.</Text>
          <Text style={styles.subtitle}>Personalized triathlon training and everyday nutrition for busy women—with the flexibility real life requires.</Text>
        </View>
        <View style={styles.actions}>
          <Button title="Create my plan" onPress={() => router.push('/auth')} icon="arrow-forward" />
          <Button title="Explore with demo data" variant="secondary" onPress={() => { useDemo(); router.replace('/(tabs)'); }} />
          <Pressable onPress={() => router.push('/auth')}><Text style={styles.signIn}>Already a member? <Text style={{ fontWeight: '800' }}>Sign in</Text></Text></Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }, safe: { flex: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, mark: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, brandName: { ...type.h2, color: colors.forestDeep, letterSpacing: 0.5 },
  visual: { height: 230, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.md }, orbitOuter: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: '#8CA79A60' }, orbitMiddle: { position: 'absolute', width: 155, height: 155, borderRadius: 78, borderWidth: 1, borderColor: '#E1A99180' }, orbitInner: { width: 95, height: 95, borderRadius: 48, backgroundColor: '#FFFFFFCC', alignItems: 'center', justifyContent: 'center' },
  sportDot: { position: 'absolute', width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' }, swim: { top: 16, left: '25%', backgroundColor: colors.blue }, bike: { right: '18%', top: '48%', backgroundColor: colors.gold }, run: { bottom: 9, left: '30%', backgroundColor: colors.peach },
  copy: { gap: spacing.md }, eyebrow: { ...type.label, color: colors.forest }, title: { ...type.display, color: colors.ink, fontSize: 42, lineHeight: 47 }, subtitle: { ...type.body, color: colors.inkMuted, maxWidth: 470 },
  actions: { gap: spacing.sm, marginTop: 'auto' }, signIn: { ...type.small, color: colors.inkMuted, textAlign: 'center', paddingVertical: spacing.sm },
});

