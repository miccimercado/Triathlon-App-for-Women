import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, Metric, Pill, ProgressBar, Screen, SectionTitle } from '@/components/ui';
import { colors, radius, spacing, type } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';

const menu = [
  { icon: 'watch-outline', title: 'Integrations & sync', body: 'Garmin, Apple Health, Strava and more', route: '/integrations' },
  { icon: 'barbell-outline', title: 'Strength library', body: 'Gym and home alternatives', route: '/strength' },
  { icon: 'flask-outline', title: 'Science & guardrails', body: 'Evidence, rules, and admin controls', route: '/science' },
  { icon: 'settings-outline', title: 'Privacy & settings', body: 'Export, consent, and delete data', route: '/settings' },
] as const;

export default function ProfileScreen() {
  const { profile, plan, integrations } = useAppStore();
  const completed = plan.flatMap((week) => week.workouts).filter((workout) => workout.status === 'complete').length;
  return (
    <Screen>
      <View style={styles.profile}><View style={styles.avatar}><Text style={styles.initial}>{profile.firstName.charAt(0)}</Text></View><View><Text style={styles.name}>{profile.firstName}</Text><Text style={styles.subtitle}>Age-group triathlete · {profile.goal}</Text></View></View>
      <Card tone="sage"><Text style={styles.raceLabel}>NEXT RACE</Text><Text style={styles.race}>{profile.raceName}</Text><Text style={styles.raceDate}>{profile.raceDate} · 70.3 distance</Text><View style={styles.metrics}><Metric value={`${plan.length}`} label="Weeks" /><Metric value={`${profile.weeklyHours}h`} label="Weekly cap" /><Metric value={`${completed}`} label="Completed" /></View></Card>
      <SectionTitle title="Your progress" />
      <Card><View style={styles.progressTop}><Text style={styles.menuTitle}>Plan consistency</Text><Text style={styles.progressValue}>84%</Text></View><ProgressBar value={84} /><Text style={styles.progressNote}>Consistency is a trend, not a verdict. Adjusted recovery sessions count.</Text></Card>
      <SectionTitle title="Manage" />
      <Card style={{ paddingVertical: spacing.xs }}>{menu.map((item, index) => <Pressable key={item.title} onPress={() => router.push(item.route)} style={[styles.menuItem, index > 0 && styles.border]}><View style={styles.menuIcon}><Ionicons name={item.icon} size={22} color={colors.forest} /></View><View style={{ flex: 1 }}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuBody}>{item.body}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.sage} /></Pressable>)}</Card>
      <Card tone="peach"><Text style={styles.menuTitle}>Your data, your choice</Text><Text style={styles.menuBody}>Health integrations are optional and revocable. Sensitive health data is excluded from analytics unless you explicitly opt in.</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.peachPale, alignItems: 'center', justifyContent: 'center' }, initial: { ...type.h1, color: colors.red }, name: { ...type.h1, color: colors.ink }, subtitle: { ...type.small, color: colors.inkMuted }, raceLabel: { ...type.label, color: colors.forest }, race: { ...type.h2, color: colors.ink, marginTop: spacing.xs }, raceDate: { ...type.small, color: colors.inkMuted }, metrics: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.xl }, progressTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }, progressValue: { ...type.h3, color: colors.forest }, progressNote: { ...type.small, color: colors.inkMuted, marginTop: spacing.md }, menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md }, border: { borderTopWidth: 1, borderTopColor: colors.border }, menuIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.sagePale, alignItems: 'center', justifyContent: 'center' }, menuTitle: { ...type.h3, color: colors.ink }, menuBody: { ...type.small, color: colors.inkMuted, marginTop: 2 } });
