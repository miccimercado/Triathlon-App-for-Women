import { Alert, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Header, IconButton, Pill, Screen } from '@/components/ui';
import { colors, spacing, type } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';

const providerMeta = {
  garmin: { name: 'Garmin Connect', icon: 'watch-outline', detail: 'Structured workouts, activities, and approved wellness data.' },
  apple: { name: 'Apple Health', icon: 'heart-outline', detail: 'Sleep, HRV, resting HR, workouts, steps, and optional cycle data.' },
  strava: { name: 'Strava', icon: 'speedometer-outline', detail: 'User-authorized activities for summaries and coaching calculations.' },
  trainingpeaks: { name: 'TrainingPeaks', icon: 'analytics-outline', detail: 'Planned and completed workout sync; approved access required.' },
  calendar: { name: 'Calendar', icon: 'calendar-outline', detail: 'Busy windows help place training around work and travel.' },
} as const;

export default function IntegrationsScreen() {
  const { integrations, toggleIntegration } = useAppStore();
  return (
    <Screen>
      <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
      <Header eyebrow="Permission-based" title="Integrations & sync" subtitle="Mock mode is active. Each adapter has a secure backend boundary for adding approved credentials later." />
      {integrations.map((integration) => {
        const meta = providerMeta[integration.provider];
        return <Card key={integration.provider}><View style={styles.row}><View style={styles.icon}><Ionicons name={meta.icon} size={24} color={colors.forest} /></View><View style={{ flex: 1 }}><View style={styles.nameRow}><Text style={styles.name}>{meta.name}</Text><Pill label={integration.mode} tone="neutral" /></View><Text style={styles.detail}>{meta.detail}</Text>{integration.connected ? <Text style={styles.sync}>Connected · {integration.permission} permission{integration.lastSync ? ' · synced recently' : ''}</Text> : <Text style={styles.notConnected}>{integration.provider === 'trainingpeaks' ? 'Requires approved developer access' : 'Not connected'}</Text>}</View></View><Button title={integration.connected ? 'Disconnect' : 'Connect'} variant={integration.connected ? 'ghost' : 'secondary'} onPress={() => { toggleIntegration(integration.provider); Alert.alert(integration.connected ? 'Disconnected' : 'Mock connection complete', integration.connected ? `${meta.name} access was revoked.` : `${meta.name} is connected in mock mode.`); }} /></Card>;
      })}
      <Card tone="peach"><Text style={styles.safetyTitle}>Credential safety</Text><Text style={styles.detail}>OAuth tokens belong in encrypted backend storage, never in the mobile bundle. All connections are revocable. Calendar events are never overwritten without explicit permission.</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }, icon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sagePale, alignItems: 'center', justifyContent: 'center' }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }, name: { ...type.h3, color: colors.ink }, detail: { ...type.small, color: colors.inkMuted, marginTop: 4 }, sync: { ...type.small, color: colors.forest, marginTop: spacing.sm, fontWeight: '700' }, notConnected: { ...type.small, color: colors.red, marginTop: spacing.sm }, safetyTitle: { ...type.h3, color: colors.ink } });

