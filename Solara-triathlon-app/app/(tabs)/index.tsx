import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Header, HeroGradient, IconButton, Pill, ProgressBar, Screen, SectionTitle } from '@/components/ui';
import { WorkoutCard } from '@/components/WorkoutCard';
import { colors, radius, spacing, type } from '@/theme/tokens';
import { calculateReadiness } from '@/engine/readiness';
import { generateDailyMealPlan } from '@/engine/nutrition';
import { formatShortDate } from '@/engine/date';
import { selectTodayWorkout, useAppStore } from '@/store/useAppStore';

const quickActions = [
  { icon: 'calendar-outline', label: 'Life got busy', route: '/adapt/' },
  { icon: 'flash-off-outline', label: 'Under-fueled', checkin: true },
  { icon: 'medical-outline', label: 'Migraine', checkin: true },
  { icon: 'cut-outline', label: 'Shorten', route: '/adapt/' },
] as const;

export default function TodayScreen() {
  const state = useAppStore();
  const workout = selectTodayWorkout(state);
  const readiness = calculateReadiness(state.readinessInput);
  const mealPlan = generateDailyMealPlan(state.profile, workout?.date || new Date().toISOString().slice(0, 10), workout);
  const garmin = state.integrations.find((item) => item.provider === 'garmin');
  const openAction = (item: typeof quickActions[number]) => {
    if ('checkin' in item && item.checkin) router.push('/(tabs)/checkin');
    else if (workout) router.push(`/adapt/${workout.id}`);
  };
  return (
    <Screen>
      <Header eyebrow={new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())} title={`Good morning, ${state.profile.firstName}`} subtitle="Here’s the smartest plan for today." action={<IconButton icon="notifications-outline" label="Notifications" />} />
      <HeroGradient>
        <View style={styles.readinessTop}><View><Text style={styles.heroLabel}>TODAY’S READINESS</Text><Text style={styles.readinessTitle}>{readiness.headline}</Text></View><View style={styles.score}><Text style={styles.scoreText}>{readiness.score}</Text></View></View>
        <ProgressBar value={readiness.score} color={readiness.state === 'ready' ? colors.forest : readiness.state === 'rest' ? colors.red : colors.gold} />
        <Text style={styles.heroBody}>{readiness.action}</Text>
        <Pressable onPress={() => router.push('/(tabs)/checkin')}><Text style={styles.heroLink}>Update today’s check-in →</Text></Pressable>
      </HeroGradient>

      <SectionTitle title="Today’s training" action="Full week" onAction={() => router.push('/(tabs)/plan')} />
      {workout ? <WorkoutCard workout={workout} /> : null}
      {workout ? <View style={styles.actionRow}>{quickActions.map((item) => <Pressable key={item.label} onPress={() => openAction(item)} style={styles.quick}><Ionicons name={item.icon} size={20} color={colors.forest} /><Text style={styles.quickText}>{item.label}</Text></Pressable>)}</View> : null}

      <Card tone="blue" style={styles.garmin}>
        <View style={styles.garminIcon}><Ionicons name="watch-outline" size={23} color={colors.blue} /></View>
        <View style={{ flex: 1 }}><Text style={styles.cardTitle}>Garmin {garmin?.connected ? 'ready' : 'isn’t connected'}</Text><Text style={styles.cardBody}>{garmin?.connected ? 'Your structured workout is ready to publish in mock mode.' : 'Connect to preview workout and recovery sync.'}</Text></View>
        <Button title={garmin?.connected ? 'Sync' : 'Connect'} variant="secondary" onPress={() => garmin?.connected ? Alert.alert('Mock sync complete', 'Today’s structured workout has been queued successfully.') : router.push('/integrations')} />
      </Card>

      <SectionTitle title="Fuel the whole day" action="Nutrition" onAction={() => router.push('/(tabs)/nutrition')} />
      <Card>
        <View style={styles.mealHeader}><View><Text style={styles.cardTitle}>{mealPlan.dayType === 'long' ? 'Higher-carb training day' : 'Balanced training day'}</Text><Text style={styles.cardBody}>{mealPlan.targets.carbs}g carbs · {mealPlan.targets.protein}g protein · {mealPlan.hydrationLiters}L baseline fluids</Text></View><Pill label={mealPlan.dayType} tone="peach" /></View>
        <View style={styles.meals}>{mealPlan.meals.slice(0, 4).map((meal) => <Pressable key={meal.id} onPress={() => router.push(`/meal/${meal.id}`)} style={styles.meal}><View style={styles.mealTime}><Ionicons name={meal.type === 'breakfast' ? 'sunny-outline' : meal.type === 'lunch' ? 'briefcase-outline' : meal.type === 'dinner' ? 'moon-outline' : 'ellipse-outline'} size={17} color={colors.forest} /></View><View style={{ flex: 1 }}><Text style={styles.mealType}>{meal.type.toUpperCase()}</Text><Text style={styles.mealTitle}>{meal.title}</Text></View><Ionicons name="chevron-forward" size={17} color={colors.sage} /></Pressable>)}</View>
        <Text style={styles.why}><Text style={{ fontWeight: '800' }}>Why:</Text> {mealPlan.why}</Text>
      </Card>
      <Card tone="peach"><View style={styles.nudge}><Ionicons name="heart-outline" size={24} color={colors.red} /><View style={{ flex: 1 }}><Text style={styles.cardTitle}>A gentle note</Text><Text style={styles.cardBody}>Your plan supports your health—not just your finish time. Regular meals count as training support.</Text></View></View></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  readinessTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }, heroLabel: { ...type.label, color: colors.forest }, readinessTitle: { ...type.h2, color: colors.ink, marginTop: spacing.xs, maxWidth: 250 }, score: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFFB8', alignItems: 'center', justifyContent: 'center' }, scoreText: { ...type.h2, color: colors.forestDeep }, heroBody: { ...type.small, color: colors.inkMuted, marginTop: spacing.md }, heroLink: { ...type.small, color: colors.forest, fontWeight: '800', marginTop: spacing.md },
  actionRow: { flexDirection: 'row', gap: spacing.sm }, quick: { flex: 1, minHeight: 74, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', padding: spacing.xs, gap: 5 }, quickText: { ...type.small, color: colors.ink, fontSize: 10, textAlign: 'center' },
  garmin: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, garminIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, cardTitle: { ...type.h3, color: colors.ink }, cardBody: { ...type.small, color: colors.inkMuted, marginTop: 3 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }, meals: { marginTop: spacing.md }, meal: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }, mealTime: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.sagePale, alignItems: 'center', justifyContent: 'center' }, mealType: { ...type.label, color: colors.inkMuted, fontSize: 9 }, mealTitle: { ...type.body, color: colors.ink, fontWeight: '600' }, why: { ...type.small, color: colors.inkMuted, backgroundColor: colors.cream, borderRadius: radius.md, padding: spacing.md }, nudge: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
});
