import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Header, IconButton, Pill, Screen, SectionTitle } from '@/components/ui';
import { colors, radius, spacing, type } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { plan, completeWorkout } = useAppStore();
  const workout = useMemo(() => plan.flatMap((week) => week.workouts).find((item) => item.id === id), [plan, id]);
  const [variant, setVariant] = useState<'full' | 'short' | 'lowEnergy'>('full');
  if (!workout) return <Screen><Header title="Workout not found" /><Button title="Back to plan" onPress={() => router.back()} /></Screen>;
  const duration = workout.variants[variant];
  const variantLabel = { full: 'Full version', short: 'Short version', lowEnergy: 'Low-energy' }[variant];
  return (
    <Screen>
      <View style={styles.nav}><IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} /><IconButton icon="ellipsis-horizontal" label="More options" /></View>
      <Header eyebrow={`${workout.sport} · ${workout.date}`} title={workout.title} subtitle={workout.purpose} />
      <View style={styles.pills}><Pill label={`${duration} min`} icon="time-outline" /><Pill label={workout.zone} tone={workout.intensity === 'hard' ? 'peach' : 'sage'} /><Pill label={`Priority ${workout.priority}`} tone="neutral" /></View>
      <Card tone="sage"><Text style={styles.whyLabel}>WHY THIS IS HERE</Text><Text style={styles.why}>{workout.why}</Text></Card>
      <SectionTitle title="Choose today’s version" />
      <View style={styles.variants}>{(['full', 'short', 'lowEnergy'] as const).map((item) => <Pressable key={item} onPress={() => setVariant(item)} style={[styles.variant, variant === item && styles.variantActive]}><Text style={[styles.variantTitle, variant === item && styles.variantTitleActive]}>{({ full: 'Full', short: 'Short', lowEnergy: 'Low energy' })[item]}</Text><Text style={[styles.variantTime, variant === item && styles.variantTitleActive]}>{workout.variants[item]} min</Text></Pressable>)}</View>
      <SectionTitle title="Structured steps" action="Garmin preview" />
      <Card style={{ paddingVertical: spacing.sm }}>{workout.steps.map((step, index) => <View key={step.order} style={[styles.step, index > 0 && styles.border]}><View style={styles.stepNum}><Text style={styles.stepNumText}>{step.order}</Text></View><View style={{ flex: 1 }}><Text style={styles.stepTitle}>{step.label}</Text><Text style={styles.stepMeta}>{step.zone}{step.target ? ` · ${step.target}` : ''}</Text></View><Text style={styles.stepTime}>{Math.round(step.minutes * duration / workout.durationMinutes)}m</Text></View>)}</Card>
      <SectionTitle title="Fuel & recover" />
      <Card><View style={styles.guide}><View style={[styles.guideIcon, { backgroundColor: colors.peachPale }]}><Ionicons name="flash-outline" size={21} color={colors.red} /></View><View style={{ flex: 1 }}><Text style={styles.guideTitle}>Fueling</Text><Text style={styles.guideBody}>{workout.fueling}</Text></View></View><View style={[styles.guide, styles.border, { paddingTop: spacing.md }]}><View style={[styles.guideIcon, { backgroundColor: colors.bluePale }]}><Ionicons name="leaf-outline" size={21} color={colors.blue} /></View><View style={{ flex: 1 }}><Text style={styles.guideTitle}>Recovery</Text><Text style={styles.guideBody}>{workout.recovery}</Text></View></View></Card>
      {workout.sport === 'strength' ? <Card tone="lilac"><Text style={styles.guideTitle}>Equipment alternatives</Text><Text style={styles.guideBody}>Squat: goblet, barbell, or controlled bodyweight. Hinge: dumbbell RDL, kettlebell deadlift, or banded good morning. Keep 2–3 good reps in reserve.</Text></Card> : null}
      <Button title="Sync structured workout" variant="secondary" icon="watch-outline" onPress={() => Alert.alert('Mock Garmin sync complete', 'The workout structure was queued successfully. Live publishing requires Garmin developer approval.')} />
      <Button title={workout.status === 'complete' ? 'Completed' : 'Mark complete'} disabled={workout.status === 'complete'} onPress={() => { completeWorkout(workout.id); Alert.alert('Nicely done', 'Your completion and load have been updated.'); }} />
      <Button title="I missed or need to change this" variant="ghost" onPress={() => router.push(`/adapt/${workout.id}`)} />
      <Text style={styles.disclaimer}>Use RPE and symptoms over device targets. Stop and seek qualified guidance for concerning pain or symptoms.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({ nav: { flexDirection: 'row', justifyContent: 'space-between' }, pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, whyLabel: { ...type.label, color: colors.forest }, why: { ...type.body, color: colors.ink, marginTop: spacing.sm }, variants: { flexDirection: 'row', gap: spacing.sm }, variant: { flex: 1, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: radius.md }, variantActive: { backgroundColor: colors.forestDeep, borderColor: colors.forestDeep }, variantTitle: { ...type.small, color: colors.ink, fontWeight: '700' }, variantTitleActive: { color: colors.white }, variantTime: { ...type.small, color: colors.inkMuted, marginTop: 3 }, step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md }, border: { borderTopWidth: 1, borderTopColor: colors.border }, stepNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.sagePale, alignItems: 'center', justifyContent: 'center' }, stepNumText: { ...type.small, color: colors.forest, fontWeight: '800' }, stepTitle: { ...type.h3, color: colors.ink }, stepMeta: { ...type.small, color: colors.inkMuted }, stepTime: { ...type.h3, color: colors.ink }, guide: { flexDirection: 'row', gap: spacing.md }, guideIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' }, guideTitle: { ...type.h3, color: colors.ink }, guideBody: { ...type.small, color: colors.inkMuted, marginTop: 3 }, disclaimer: { ...type.small, color: colors.inkMuted, textAlign: 'center' } });

