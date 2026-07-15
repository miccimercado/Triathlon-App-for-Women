import { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Field, Header, IconButton, Pill, Screen, SectionTitle } from '@/components/ui';
import { scienceReferences } from '@/data/science';
import { DEFAULT_RULES } from '@/engine/training';
import { colors, spacing, type } from '@/theme/tokens';

export default function ScienceScreen() {
  const [editing, setEditing] = useState(false);
  const [easyTarget, setEasyTarget] = useState(String(DEFAULT_RULES.intensityEasyTarget * 100));
  const [loadCap, setLoadCap] = useState(String(DEFAULT_RULES.weeklyLoadCap * 100));
  const saveDraft = () => {
    const easy = Number(easyTarget); const cap = Number(loadCap);
    if (!Number.isFinite(easy) || easy < 60 || easy > 95 || !Number.isFinite(cap) || cap < 0 || cap > 20) return Alert.alert('Review rule values', 'Low intensity must be 60–95% and progression cap 0–20%.');
    Alert.alert('Draft validated', 'In production, this creates a versioned inactive draft and audit entry. A qualified reviewer must approve it before activation.');
    setEditing(false);
  };
  return (
    <Screen>
      <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
      <Header eyebrow="Admin preview" title="Science & rules" subtitle="Versioned deterministic rules are separate from UI. Production edits should require an admin role and create an audit entry." />
      <SectionTitle title="Active training rules" action={editing ? 'Cancel' : 'Edit draft'} onAction={() => setEditing(!editing)} />
      <Card>
        {editing ? <><Field label="Low-intensity target (%)" value={easyTarget} onChangeText={setEasyTarget} keyboardType="number-pad" hint="Allowed 60–95. Applied across suitable blocks, not forced weekly." /><View style={{ height: spacing.md }} /><Field label="Weekly progression cap (%)" value={loadCap} onChangeText={setLoadCap} keyboardType="number-pad" hint="Allowed 0–20. Recovery, taper, illness, and travel may reduce load further." /><View style={{ height: spacing.md }} /><Button title="Validate rule draft" onPress={saveDraft} /></> : <>
        <Rule label="Low-intensity target" value={`${easyTarget}% across suitable blocks`} />
        <Rule label="Weekly progression cap" value={`${loadCap}% outside recovery/taper`} />
        <Rule label="Recovery frequency" value={`Every ${DEFAULT_RULES.recoveryEveryWeeks} weeks by default`} />
        <Rule label="Taper" value={`${DEFAULT_RULES.taperWeeks} weeks, individualized`} last /></>}
      </Card>
      <Card tone="lilac"><Text style={styles.ruleTitle}>Women-specific guardrail</Text><Text style={styles.ruleBody}>Cycle phase alone never prescribes a harder or easier workout. Symptoms, personal history, objective recovery data, and user preference must materially support any adjustment.</Text></Card>
      <Card tone="peach"><Text style={styles.ruleTitle}>Migraine & red-flag guardrail</Text><Text style={styles.ruleBody}>Active migraine defaults to rest/recovery guidance. Sudden severe headache, neurological symptoms, chest pain, fainting, severe dehydration, or unusual symptoms prompt urgent professional guidance—not a diagnosis.</Text></Card>
      <SectionTitle title="Evidence library" />
      {scienceReferences.map((reference) => <Pressable key={reference.id} onPress={() => Linking.openURL(reference.url)}><Card><View style={styles.refTop}><Pill label={reference.topic} tone="sage" /><Ionicons name="open-outline" size={17} color={colors.forest} /></View><Text style={styles.citation}>{reference.citation}</Text><Text style={styles.ruleBody}>{reference.summary}</Text></Card></Pressable>)}
      <Text style={styles.disclaimer}>References support claims and guardrails but do not turn general evidence into individual medical advice.</Text>
    </Screen>
  );
}

function Rule({ label, value, last }: { label: string; value: string; last?: boolean }) { return <View style={[styles.rule, !last && styles.border]}><Text style={styles.ruleTitle}>{label}</Text><Text style={styles.ruleValue}>{value}</Text></View>; }
const styles = StyleSheet.create({ rule: { paddingVertical: spacing.md }, border: { borderBottomWidth: 1, borderBottomColor: colors.border }, ruleTitle: { ...type.h3, color: colors.ink }, ruleValue: { ...type.small, color: colors.forest, marginTop: 3, fontWeight: '700' }, ruleBody: { ...type.small, color: colors.inkMuted, marginTop: spacing.sm }, refTop: { flexDirection: 'row', justifyContent: 'space-between' }, citation: { ...type.h3, color: colors.ink, marginTop: spacing.md }, disclaimer: { ...type.small, color: colors.inkMuted, textAlign: 'center' } });
