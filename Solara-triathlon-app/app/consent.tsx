import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Choice, Header, IconButton, Screen } from '@/components/ui';
import { colors, spacing, type } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';

const points = [
  ['medical-outline', 'Not medical care', 'Solara does not diagnose or replace a doctor, registered dietitian, physiotherapist, or human coach.'],
  ['shield-checkmark-outline', 'You control permissions', 'Cycle, migraine, recovery, nutrition, and integration data are optional and revocable.'],
  ['alert-circle-outline', 'Safety comes first', 'Urgent or unusual symptoms should be assessed by a qualified clinician; emergency symptoms need emergency care.'],
] as const;

export default function ConsentScreen() {
  const [healthConsent, setHealthConsent] = useState(false);
  const [trainingConsent, setTrainingConsent] = useState(false);
  const setConsented = useAppStore((state) => state.setConsented);
  const proceed = () => {
    if (!healthConsent || !trainingConsent) return Alert.alert('Consent required', 'Please acknowledge both items to continue.');
    setConsented(true); router.push('/onboarding');
  };
  return (
    <Screen>
      <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
      <Header eyebrow="Privacy & safety" title="Before we begin" subtitle="Please read this carefully. Your wellbeing matters more than completing any workout." />
      {points.map(([icon, title, body]) => <Card key={title} style={styles.point}><View style={styles.pointIcon}><Ionicons name={icon} size={22} color={colors.forest} /></View><View style={{ flex: 1 }}><Text style={styles.pointTitle}>{title}</Text><Text style={styles.pointBody}>{body}</Text></View></Card>)}
      <View style={styles.choices}>
        <Choice selected={healthConsent} onPress={() => setHealthConsent(!healthConsent)} label="I consent to using the health information I choose to provide for personalized recommendations." />
        <Choice selected={trainingConsent} onPress={() => setTrainingConsent(!trainingConsent)} label="I understand training carries risk and this app is informational, not medical advice." />
      </View>
      <Button title="I understand — continue" onPress={proceed} />
    </Screen>
  );
}

const styles = StyleSheet.create({ point: { flexDirection: 'row', gap: spacing.md, shadowOpacity: 0 }, pointIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.sagePale, alignItems: 'center', justifyContent: 'center' }, pointTitle: { ...type.h3, color: colors.ink }, pointBody: { ...type.small, color: colors.inkMuted, marginTop: 3 }, choices: { gap: spacing.sm } });

