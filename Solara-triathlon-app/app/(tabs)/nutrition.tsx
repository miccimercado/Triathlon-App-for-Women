import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Header, HeroGradient, Metric, Pill, ProgressBar, Screen, SectionTitle } from '@/components/ui';
import { generateDailyMealPlan, groceryList } from '@/engine/nutrition';
import { selectTodayWorkout, useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing, type } from '@/theme/tokens';

const toolCards = [
  { icon: 'basket-outline', title: 'Grocery list', body: '24 ingredients', route: '/fueling?tab=grocery', tone: colors.sagePale },
  { icon: 'timer-outline', title: 'Meal prep', body: 'Sunday · 55 min', route: '/fueling?tab=prep', tone: colors.lilacPale },
  { icon: 'water-outline', title: 'Hydration', body: '2.8 L baseline', route: '/fueling?tab=hydration', tone: colors.bluePale },
  { icon: 'flag-outline', title: 'Race fueling', body: 'Practice plan', route: '/fueling?tab=race', tone: colors.peachPale },
] as const;

export default function NutritionScreen() {
  const state = useAppStore();
  const workout = selectTodayWorkout(state);
  const plan = generateDailyMealPlan(state.profile, workout?.date || new Date().toISOString().slice(0, 10), workout);
  const macroTotal = plan.targets.carbs * 4 + plan.targets.protein * 4 + plan.targets.fat * 9;
  return (
    <Screen>
      <Header eyebrow="Everyday nutrition" title="Fuel your full day" subtitle="At home, at work, during training, and through recovery." />
      <HeroGradient>
        <View style={styles.heroTop}><View><Text style={styles.eyebrow}>{plan.dayType.toUpperCase()} DAY</Text><Text style={styles.heroTitle}>{plan.targets.calories} kcal guide</Text></View><Pill label="Adjustable" tone="neutral" /></View>
        <Text style={styles.heroBody}>Targets are flexible estimates—not ceilings. Hunger, training response, recovery, and qualified clinical guidance take priority.</Text>
        <View style={styles.macroRow}><View style={styles.macro}><Text style={styles.macroValue}>{plan.targets.carbs}g</Text><Text style={styles.macroLabel}>CARBS</Text></View><View style={styles.macro}><Text style={styles.macroValue}>{plan.targets.protein}g</Text><Text style={styles.macroLabel}>PROTEIN</Text></View><View style={styles.macro}><Text style={styles.macroValue}>{plan.targets.fat}g</Text><Text style={styles.macroLabel}>FAT</Text></View></View>
      </HeroGradient>
      <SectionTitle title="Today’s meals" action="Weekly plan" />
      <Card>
        {plan.meals.map((meal, index) => <Pressable key={meal.id} onPress={() => router.push(`/meal/${meal.id}`)} style={[styles.meal, index > 0 && styles.mealBorder]}><View style={[styles.mealIcon, { backgroundColor: meal.type === 'fuel' ? colors.peachPale : colors.sagePale }]}><Ionicons name={meal.type === 'breakfast' ? 'sunny-outline' : meal.type === 'lunch' ? 'briefcase-outline' : meal.type === 'dinner' ? 'moon-outline' : meal.type === 'fuel' ? 'flash-outline' : 'nutrition-outline'} size={19} color={colors.forest} /></View><View style={{ flex: 1 }}><Text style={styles.mealType}>{meal.type.toUpperCase()} · {meal.prepMinutes} MIN</Text><Text style={styles.mealTitle}>{meal.title}</Text><Text style={styles.mealBody}>{meal.description}</Text></View><Text style={styles.kcal}>{meal.calories}</Text></Pressable>)}
      </Card>
      <SectionTitle title="Plan & prepare" />
      <View style={styles.toolGrid}>{toolCards.map((tool) => <Pressable key={tool.title} onPress={() => router.push(tool.route)} style={[styles.tool, { backgroundColor: tool.tone }]}><Ionicons name={tool.icon} size={24} color={colors.forestDeep} /><Text style={styles.toolTitle}>{tool.title}</Text><Text style={styles.toolBody}>{tool.body}</Text></Pressable>)}</View>
      <Card tone="blue"><View style={styles.hydration}><Ionicons name="water" size={28} color={colors.blue} /><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{plan.hydrationLiters} L baseline + training fluids</Text><Text style={styles.cardBody}>{plan.sodiumNote}</Text></View></View></Card>
      <Card tone="peach"><Text style={styles.cardTitle}>Health over numbers</Text><Text style={styles.cardBody}>Missed periods, recurring injuries, persistent fatigue, food anxiety, pregnancy/postpartum needs, anemia, or ongoing GI concerns deserve support from a registered dietitian and/or doctor.</Text></Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ heroTop: { flexDirection: 'row', justifyContent: 'space-between' }, eyebrow: { ...type.label, color: colors.forest }, heroTitle: { ...type.h1, color: colors.ink, marginTop: spacing.xs }, heroBody: { ...type.small, color: colors.inkMuted, marginTop: spacing.md }, macroRow: { flexDirection: 'row', marginTop: spacing.xl, gap: spacing.md }, macro: { flex: 1, borderTopWidth: 1, borderTopColor: '#748F8270', paddingTop: spacing.md }, macroValue: { ...type.h2, color: colors.ink }, macroLabel: { ...type.label, color: colors.inkMuted, fontSize: 9 }, meal: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md, alignItems: 'center' }, mealBorder: { borderTopWidth: 1, borderTopColor: colors.border }, mealIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' }, mealType: { ...type.label, color: colors.inkMuted, fontSize: 9 }, mealTitle: { ...type.h3, color: colors.ink }, mealBody: { ...type.small, color: colors.inkMuted }, kcal: { ...type.small, color: colors.inkMuted }, toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, tool: { width: '48.5%', minHeight: 135, borderRadius: radius.lg, padding: spacing.lg, justifyContent: 'flex-end' }, toolTitle: { ...type.h3, color: colors.ink, marginTop: spacing.md }, toolBody: { ...type.small, color: colors.inkMuted }, hydration: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' }, cardTitle: { ...type.h3, color: colors.ink }, cardBody: { ...type.small, color: colors.inkMuted, marginTop: 4 } });

