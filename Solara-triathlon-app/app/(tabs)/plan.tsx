import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Header, Metric, Pill, ProgressBar, Screen, SectionTitle } from '@/components/ui';
import { WorkoutCard } from '@/components/WorkoutCard';
import { colors, radius, spacing, type } from '@/theme/tokens';
import { formatDay, formatShortDate } from '@/engine/date';
import { intensityDistribution } from '@/engine/training';
import { useAppStore } from '@/store/useAppStore';

export default function PlanScreen() {
  const plan = useAppStore((state) => state.plan);
  const profile = useAppStore((state) => state.profile);
  const [weekIndex, setWeekIndex] = useState(0);
  const week = plan[weekIndex] || plan[0];
  const distribution = useMemo(() => intensityDistribution(week?.workouts || []), [week]);
  return (
    <Screen>
      <Header eyebrow={`${profile.raceName} · ${plan.length} weeks`} title="Your race plan" subtitle={`${formatShortDate(plan[0]?.startDate)} – ${formatShortDate(profile.raceDate)}`} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekPicker}>
        {plan.map((item, index) => <Pressable key={item.index} onPress={() => setWeekIndex(index)} style={[styles.weekChip, index === weekIndex && styles.weekActive]}><Text style={[styles.weekNum, index === weekIndex && styles.weekNumActive]}>{item.index}</Text><Text style={[styles.weekPhase, index === weekIndex && styles.weekNumActive]}>{item.phase}</Text></Pressable>)}
      </ScrollView>
      <Card tone={week?.isRecovery ? 'lilac' : 'sage'}>
        <View style={styles.phaseTop}><View><Text style={styles.phaseEyebrow}>WEEK {week?.index} · {week?.phase.toUpperCase()}</Text><Text style={styles.phaseTitle}>{week?.isRecovery ? 'Absorb the work' : week?.phase === 'taper' ? 'Freshen up, stay sharp' : 'Build with patience'}</Text></View><Pill label={`${week?.targetHours} hours`} tone="neutral" /></View>
        <View style={styles.metrics}><Metric value={`${distribution.easyPercent}%`} label="Low intensity" accent={colors.forest} /><Metric value={`${distribution.qualityPercent}%`} label="Quality" accent={colors.peach} /><Metric value={`${week?.workouts.length}`} label="Sessions" accent={colors.lilac} /></View>
        <View style={styles.distribution}><ProgressBar value={distribution.easyPercent} /><Text style={styles.distributionText}>Intensity is monitored across the training block; it does not need to equal exactly 80/20 every week.</Text></View>
      </Card>
      <SectionTitle title="Week at a glance" />
      <View style={styles.days}>{week?.workouts.map((workout) => <View key={workout.id} style={styles.day}><View style={styles.date}><Text style={styles.dayName}>{formatDay(workout.date).toUpperCase()}</Text><Text style={styles.dateNum}>{workout.date.slice(-2)}</Text></View><View style={{ flex: 1 }}><WorkoutCard workout={workout} compact /></View></View>)}</View>
      <Card tone="peach"><Text style={styles.safetyTitle}>Safe rescheduling</Text><Text style={styles.safetyBody}>Move one workout at a time. Solara protects key-session spacing and will remove lower-priority work before it crams missed volume into your week.</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ weekPicker: { gap: spacing.sm, paddingRight: spacing.lg }, weekChip: { width: 58, height: 58, backgroundColor: colors.white, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }, weekActive: { backgroundColor: colors.forestDeep, borderColor: colors.forestDeep }, weekNum: { ...type.h3, color: colors.ink }, weekNumActive: { color: colors.white }, weekPhase: { ...type.small, color: colors.inkMuted, fontSize: 9, textTransform: 'capitalize' }, phaseTop: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }, phaseEyebrow: { ...type.label, color: colors.forest }, phaseTitle: { ...type.h2, color: colors.ink, marginTop: 4 }, metrics: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xl }, distribution: { gap: spacing.sm, marginTop: spacing.xl }, distributionText: { ...type.small, color: colors.inkMuted }, days: { gap: spacing.sm }, day: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }, date: { width: 38, alignItems: 'center' }, dayName: { ...type.label, color: colors.inkMuted, fontSize: 9 }, dateNum: { ...type.h3, color: colors.ink }, safetyTitle: { ...type.h3, color: colors.ink }, safetyBody: { ...type.small, color: colors.inkMuted, marginTop: spacing.xs } });
