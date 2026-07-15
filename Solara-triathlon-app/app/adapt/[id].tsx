import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Choice, Header, IconButton, Screen } from '@/components/ui';
import { AdaptationChoice } from '@/engine/adaptation';
import { colors, spacing, type } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';

const options: Array<{ value: AdaptationChoice; label: string; detail: string }> = [
  { value: 'keep', label: 'Keep plan as-is', detail: 'Let this one go; preserve the rest of the week.' },
  { value: 'reschedule', label: 'Reschedule safely', detail: 'Move it only if a lower-priority slot protects recovery.' },
  { value: 'minimum', label: 'Minimum effective session', detail: 'Keep the movement pattern with less time and intensity.' },
  { value: 'recovery', label: 'Convert to recovery', detail: 'Use gentle mobility and protect the next key session.' },
];

export default function AdaptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { plan, adaptMissed } = useAppStore();
  const workout = useMemo(() => plan.flatMap((week) => week.workouts).find((item) => item.id === id), [plan, id]);
  const [choice, setChoice] = useState<AdaptationChoice>('keep');
  const [result, setResult] = useState<string>();
  const apply = () => { const next = adaptMissed(id, choice); if (next) setResult(next.explanation); };
  return (
    <Screen>
      <IconButton icon="close" label="Close" onPress={() => router.back()} />
      <Header eyebrow="Life happens" title="Adjust without cramming" subtitle={workout ? `${workout.title} · ${workout.durationMinutes} min` : 'Choose the safest option for your week.'} />
      <Card tone="peach"><Text style={styles.reassure}>Missing one workout will not erase your fitness. We prioritize key sessions, recovery spacing, and the load your body can actually absorb.</Text></Card>
      {options.map((option) => <Choice key={option.value} label={option.label} detail={option.detail} selected={choice === option.value} onPress={() => { setChoice(option.value); setResult(undefined); }} />)}
      {result ? <Card tone="sage"><Text style={styles.resultLabel}>YOUR UPDATED PLAN</Text><Text style={styles.result}>{result}</Text></Card> : null}
      <Button title={result ? 'Return to today' : 'Apply smart adjustment'} onPress={result ? () => router.replace('/(tabs)') : apply} />
      {!result ? <Button title="Cancel" variant="ghost" onPress={() => router.back()} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ reassure: { ...type.body, color: colors.ink }, resultLabel: { ...type.label, color: colors.forest }, result: { ...type.body, color: colors.ink, marginTop: spacing.sm } });

