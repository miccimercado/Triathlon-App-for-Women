import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Choice, Header, Pill, ProgressBar, Screen } from '@/components/ui';
import { calculateReadiness } from '@/engine/readiness';
import { useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing, type } from '@/theme/tokens';

function Scale({ label, low, high, value, onChange }: { label: string; low: string; high: string; value: number; onChange: (value: number) => void }) {
  return <View style={styles.scale}><Text style={styles.scaleTitle}>{label}</Text><View style={styles.scaleRow}>{[1, 2, 3, 4, 5].map((num) => <Pressable key={num} onPress={() => onChange(num)} style={[styles.scaleDot, value === num && styles.scaleDotActive]}><Text style={[styles.scaleNum, value === num && styles.scaleNumActive]}>{num}</Text></Pressable>)}</View><View style={styles.scaleLabels}><Text style={styles.scaleHint}>{low}</Text><Text style={styles.scaleHint}>{high}</Text></View></View>;
}

export default function CheckinScreen() {
  const stored = useAppStore((state) => state.readinessInput);
  const setStored = useAppStore((state) => state.setReadiness);
  const [input, setInput] = useState(stored);
  const result = calculateReadiness(input);
  const update = <K extends keyof typeof input>(key: K, value: typeof input[K]) => setInput({ ...input, [key]: value });
  const save = () => { setStored(input); Alert.alert('Check-in saved', result.action, [{ text: 'See today', onPress: () => router.push('/(tabs)') }]); };
  return (
    <Screen>
      <Header eyebrow="60-second check-in" title="How are you, really?" subtitle="Only signals that materially affect training will change the plan." />
      <Card tone={result.state === 'ready' ? 'sage' : result.state === 'rest' ? 'peach' : 'lilac'}>
        <View style={styles.resultTop}><View><Text style={styles.resultLabel}>LIVE READINESS</Text><Text style={styles.resultTitle}>{result.headline}</Text></View><Text style={styles.resultScore}>{result.score}</Text></View><ProgressBar value={result.score} color={result.state === 'ready' ? colors.forest : result.state === 'rest' ? colors.red : colors.gold} /><Text style={styles.resultBody}>{result.action}</Text>
      </Card>
      <Scale label="Sleep quality" low="Very poor" high="Excellent" value={input.sleep} onChange={(value) => update('sleep', value)} />
      <Scale label="Stress" low="Low" high="Very high" value={input.stress} onChange={(value) => update('stress', value)} />
      <Scale label="Soreness" low="None" high="Severe" value={input.soreness} onChange={(value) => update('soreness', value)} />
      <Scale label="Energy / fatigue" low="Fresh" high="Exhausted" value={input.fatigue} onChange={(value) => update('fatigue', value)} />
      <Scale label="Mood" low="Very low" high="Very good" value={input.mood} onChange={(value) => update('mood', value)} />
      <View style={styles.group}><Text style={styles.groupTitle}>Migraine status</Text>{(['none', 'warning', 'active', 'recovery'] as const).map((item) => <Choice key={item} label={{ none: 'None', warning: 'Warning signs', active: 'Active migraine', recovery: 'Post-migraine recovery' }[item]} selected={input.migraine === item} onPress={() => update('migraine', item)} />)}</View>
      <Scale label="Cycle-related symptom impact" low="None" high="High" value={input.cycleSymptomSeverity} onChange={(value) => update('cycleSymptomSeverity', value)} />
      <Choice label="I feel under-fueled or have missed meals" selected={input.underFueled} onPress={() => update('underFueled', !input.underFueled)} />
      <Choice label="I have illness symptoms" selected={input.illnessSymptoms} onPress={() => update('illnessSymptoms', !input.illnessSymptoms)} />
      {input.migraine === 'active' ? <Card tone="peach"><Text style={styles.warningTitle}>Safety note</Text><Text style={styles.warningBody}>Rest, maintain regular fluids and meals as tolerated, and seek care for a sudden severe headache, fainting, chest pain, unusual neurological symptoms, severe dehydration, or anything severe or unusual for you.</Text></Card> : null}
      <Button title="Save and adjust today" onPress={save} />
      <Text style={styles.disclaimer}>This check-in supports conservative training adjustments. It does not diagnose or treat health conditions.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({ resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }, resultLabel: { ...type.label, color: colors.forest }, resultTitle: { ...type.h2, color: colors.ink, maxWidth: 270, marginTop: 3 }, resultScore: { ...type.h1, color: colors.forestDeep }, resultBody: { ...type.small, color: colors.inkMuted, marginTop: spacing.md }, scale: { gap: spacing.sm }, scaleTitle: { ...type.h3, color: colors.ink }, scaleRow: { flexDirection: 'row', gap: spacing.sm }, scaleDot: { flex: 1, aspectRatio: 1.35, borderRadius: radius.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, scaleDotActive: { backgroundColor: colors.forestDeep, borderColor: colors.forestDeep }, scaleNum: { ...type.h3, color: colors.inkMuted }, scaleNumActive: { color: colors.white }, scaleLabels: { flexDirection: 'row', justifyContent: 'space-between' }, scaleHint: { ...type.small, color: colors.inkMuted }, group: { gap: spacing.sm }, groupTitle: { ...type.h3, color: colors.ink }, warningTitle: { ...type.h3, color: colors.red }, warningBody: { ...type.small, color: colors.inkMuted, marginTop: spacing.xs }, disclaimer: { ...type.small, color: colors.inkMuted, textAlign: 'center' } });

