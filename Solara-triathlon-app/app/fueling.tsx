import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, IconButton, Pill, Screen, SectionTitle } from '@/components/ui';
import { generateDailyMealPlan, groceryList } from '@/engine/nutrition';
import { selectTodayWorkout, useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing, type } from '@/theme/tokens';

const tabs = ['grocery', 'prep', 'hydration', 'race'] as const;

export default function FuelingScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<typeof tabs[number]>(tabs.includes(params.tab as any) ? params.tab as any : 'race');
  const state = useAppStore();
  const workout = selectTodayWorkout(state);
  const daily = generateDailyMealPlan(state.profile, new Date().toISOString().slice(0, 10), workout);
  const list = groceryList([daily]);
  return (
    <Screen>
      <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
      <Header eyebrow="Plan, practice, personalize" title="Fueling toolkit" subtitle="Everyday preparation and long-course practice—without universal one-size-fits-all targets." />
      <View style={styles.tabs}>{tabs.map((item) => <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text></Pressable>)}</View>
      {tab === 'grocery' ? <><SectionTitle title="This week’s grocery list" /><Card>{list.map((item, index) => <View key={item} style={[styles.row, index > 0 && styles.border]}><View style={styles.checkbox} /><Text style={styles.rowText}>{item}</Text></View>)}</Card></> : null}
      {tab === 'prep' ? <><Card tone="lilac"><Text style={styles.title}>Sunday · 55 minutes</Text><Text style={styles.body}>A small batch plan that leaves room for fresh meals and changing workdays.</Text></Card>{['Cook brown rice and lentil pasta base', 'Roast tofu and two trays of vegetables', 'Mix sesame-lime dressing', 'Assemble three overnight oats', 'Portion portable snacks and training fuel'].map((item, index) => <Card key={item}><View style={styles.step}><Text style={styles.stepNum}>{index + 1}</Text><Text style={styles.rowText}>{item}</Text></View></Card>)}</> : null}
      {tab === 'hydration' ? <><Card tone="blue"><Text style={styles.big}>2.1 L</Text><Text style={styles.title}>Baseline from body-size estimate</Text><Text style={styles.body}>Plus training fluid based on thirst, conditions, duration, and your measured experience. This is a starting point, not a prescription.</Text></Card><Card><Text style={styles.title}>Sodium is individual</Text><Text style={styles.body}>Use known sweat rate, salty-sweater experience, heat, duration, and product tolerance. Avoid assuming that every athlete needs the same amount.</Text></Card><Card tone="peach"><Text style={styles.title}>Migraine-aware consistency</Text><Text style={styles.body}>Avoid skipped meals, maintain regular hydration, and track only your known triggers. Seek medical advice for changing or unusual symptoms.</Text></Card></> : null}
      {tab === 'race' ? <><Card tone="peach"><Text style={styles.raceLabel}>70.3 PRACTICE RANGE</Text><Text style={styles.big}>60–90g</Text><Text style={styles.title}>carbohydrate per bike hour</Text><Text style={styles.body}>Begin within your current tolerance, build gradually during long rides, and rehearse the exact products and timing. Your final plan depends on gut tolerance, pace, conditions, and qualified advice.</Text></Card><SectionTitle title="Race-day rehearsal" />{[
        ['3–4 h before', 'Familiar carbohydrate-rich breakfast with moderate protein; keep fat and fibre within your tested tolerance.'],
        ['15 min before', 'Optional small carbohydrate top-up if practiced.'],
        ['Bike', 'Practice 60–90 g carbohydrate/hour, individualized fluid, and tested sodium.'],
        ['Run', 'Practice 30–60 g carbohydrate/hour or your tolerated plan; use aid stations deliberately.'],
        ['Finish', 'Fluids, carbohydrate, protein, and a normal meal when comfortable.'],
      ].map(([time, body]) => <Card key={time}><Pill label={time} tone="sage" /><Text style={styles.body}>{body}</Text></Card>)}<Card tone="sage"><Text style={styles.title}>Gut training is training</Text><Text style={styles.body}>Increase carbohydrate delivery gradually, test products during race-specific sessions, and log GI response. Never debut a fueling strategy on race day.</Text></Card></> : null}
      <Text style={styles.disclaimer}>Medical nutrition therapy, pregnancy/postpartum fueling, eating-disorder history, REDs risk, anemia, or persistent GI issues should be managed with a registered dietitian and/or doctor.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({ tabs: { flexDirection: 'row', backgroundColor: colors.cream, borderRadius: radius.md, padding: 4 }, tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 11 }, tabActive: { backgroundColor: colors.forestDeep }, tabText: { ...type.small, color: colors.inkMuted, textTransform: 'capitalize', fontSize: 11 }, tabTextActive: { color: colors.white }, row: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md, alignItems: 'center' }, border: { borderTopWidth: 1, borderTopColor: colors.border }, checkbox: { width: 22, height: 22, borderWidth: 1.5, borderColor: colors.sage, borderRadius: 6 }, rowText: { ...type.body, color: colors.ink, flex: 1, textTransform: 'capitalize' }, title: { ...type.h3, color: colors.ink, marginTop: 3 }, body: { ...type.body, color: colors.inkMuted, marginTop: spacing.sm }, step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, stepNum: { ...type.h3, color: colors.forest }, big: { ...type.display, color: colors.ink }, raceLabel: { ...type.label, color: colors.red }, disclaimer: { ...type.small, color: colors.inkMuted, textAlign: 'center' } });
