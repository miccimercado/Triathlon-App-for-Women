import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Header, IconButton, Metric, Pill, Screen, SectionTitle } from '@/components/ui';
import { mealLibrary } from '@/engine/nutrition';
import { colors, radius, spacing, type } from '@/theme/tokens';

export default function MealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const meal = mealLibrary.find((item) => item.id === id) || mealLibrary[0];
  return (
    <Screen>
      <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
      <View style={styles.hero}><Ionicons name={meal.type === 'fuel' ? 'flash' : 'restaurant'} size={48} color={colors.forest} /></View>
      <Header eyebrow={`${meal.type} · ${meal.prepMinutes} minutes`} title={meal.title} subtitle={meal.description} />
      <View style={styles.tags}>{meal.tags.map((tag) => <Pill key={tag} label={tag} tone="sage" />)}</View>
      <Card><View style={styles.macros}><Metric value={`${meal.calories}`} label="kcal" /><Metric value={`${meal.carbs}g`} label="Carbs" /><Metric value={`${meal.protein}g`} label="Protein" /><Metric value={`${meal.fat}g`} label="Fat" /></View></Card>
      <SectionTitle title="Ingredients" />
      <Card>{meal.ingredients.map((ingredient, index) => <View key={ingredient} style={[styles.ingredient, index > 0 && styles.border]}><View style={styles.dot} /><Text style={styles.ingredientText}>{ingredient}</Text></View>)}</Card>
      <SectionTitle title="Make it" />
      <Card tone="sage"><Text style={styles.instructions}>{meal.type === 'fuel' ? 'Toast the bread, add honey and a small pinch of salt. Adjust portion and timing to your tolerance.' : 'Prepare the base, add the protein and produce, then finish with the dressing or seasoning. Divide into workday containers if meal prepping.'}</Text></Card>
      <Card tone="peach"><Text style={styles.swapTitle}>Easy substitutions</Text><Text style={styles.swapBody}>Swap dairy for a fortified alternative, tofu for eggs or legumes, and grains based on allergies and preference. Recalculate targets when substitutions materially change portions.</Text></Card>
      <Button title="Add ingredients to grocery list" variant="secondary" icon="basket-outline" />
    </Screen>
  );
}

const styles = StyleSheet.create({ hero: { height: 170, borderRadius: radius.xl, backgroundColor: colors.sagePale, alignItems: 'center', justifyContent: 'center' }, tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, macros: { flexDirection: 'row', gap: spacing.md }, ingredient: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md }, border: { borderTopWidth: 1, borderTopColor: colors.border }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.peach }, ingredientText: { ...type.body, color: colors.ink, textTransform: 'capitalize' }, instructions: { ...type.body, color: colors.ink }, swapTitle: { ...type.h3, color: colors.ink }, swapBody: { ...type.small, color: colors.inkMuted, marginTop: spacing.xs } });
