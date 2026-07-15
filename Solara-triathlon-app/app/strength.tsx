import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, IconButton, Pill, Screen, SectionTitle } from '@/components/ui';
import { colors, spacing, type } from '@/theme/tokens';

const exercises = [
  { name: 'Goblet squat', dose: '3 × 6–8 · 90s rest', purpose: 'Lower-body force', alternatives: 'Barbell squat · split squat · controlled bodyweight squat' },
  { name: 'Romanian deadlift', dose: '3 × 8 · 90s rest', purpose: 'Posterior chain', alternatives: 'Kettlebell deadlift · banded good morning · single-leg hinge' },
  { name: 'Rear-foot elevated split squat', dose: '2 × 8/side · 75s rest', purpose: 'Single-leg stability', alternatives: 'Reverse lunge · step-up · supported split squat' },
  { name: 'One-arm row', dose: '3 × 10/side · 60s rest', purpose: 'Swim shoulder support', alternatives: 'Cable row · band row · chest-supported row' },
  { name: 'Pallof press', dose: '3 × 10/side · 45s rest', purpose: 'Anti-rotation core', alternatives: 'Dead bug · side plank · suitcase carry' },
];

export default function StrengthScreen() {
  return (
    <Screen>
      <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
      <Header eyebrow="Base & build · 2× weekly" title="Stable & strong" subtitle="40 minutes · Dumbbells, bands, barbell, or bodyweight alternatives." />
      <Card tone="lilac"><Text style={styles.title}>Today’s intent</Text><Text style={styles.body}>Build durable force without chasing fatigue. Stop each set with 2–3 technically strong reps still available.</Text><View style={styles.pills}><Pill label="RPE 6–7" tone="neutral" /><Pill label="Not to failure" tone="neutral" /><Pill label="40 min" tone="neutral" /></View></Card>
      <SectionTitle title="Warm-up · 7 min" />
      <Card><Text style={styles.body}>90/90 hip switches · ankle rocks · thoracic rotations · glute bridge · band pull-apart · two easy rehearsal sets.</Text></Card>
      <SectionTitle title="Main work" />
      {exercises.map((exercise, index) => <Card key={exercise.name}><View style={styles.exerciseTop}><View style={styles.num}><Text style={styles.numText}>{index + 1}</Text></View><View style={{ flex: 1 }}><Text style={styles.title}>{exercise.name}</Text><Text style={styles.dose}>{exercise.dose}</Text></View></View><Text style={styles.purpose}>{exercise.purpose}</Text><View style={styles.alt}><Ionicons name="swap-horizontal-outline" size={17} color={colors.forest} /><Text style={styles.altText}>{exercise.alternatives}</Text></View></Card>)}
      <Card tone="peach"><Text style={styles.title}>Adjust around race proximity</Text><Text style={styles.body}>Reduce sets and heavy loading through peak and taper. With high soreness, illness, migraine symptoms, or injury pain, use mobility or recovery guidance instead.</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ title: { ...type.h3, color: colors.ink }, body: { ...type.body, color: colors.inkMuted, marginTop: spacing.xs }, pills: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' }, exerciseTop: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' }, num: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.lilacPale, alignItems: 'center', justifyContent: 'center' }, numText: { ...type.h3, color: '#625986' }, dose: { ...type.small, color: colors.forest, fontWeight: '700', marginTop: 2 }, purpose: { ...type.small, color: colors.inkMuted, marginTop: spacing.md }, alt: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.cream, padding: spacing.md, marginTop: spacing.md, borderRadius: 12 }, altText: { ...type.small, color: colors.inkMuted, flex: 1 } });

