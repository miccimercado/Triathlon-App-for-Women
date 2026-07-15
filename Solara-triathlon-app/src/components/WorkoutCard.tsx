import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Workout } from '@/types/domain';
import { colors, radius, spacing, type } from '@/theme/tokens';
import { Pill } from './ui';

const sportMeta: Record<Workout['sport'], { icon: keyof typeof Ionicons.glyphMap; color: string; pale: string }> = {
  swim: { icon: 'water-outline', color: '#4D8C95', pale: colors.bluePale },
  bike: { icon: 'bicycle-outline', color: '#A16A28', pale: '#F7E9D3' },
  run: { icon: 'walk-outline', color: '#9E5B50', pale: colors.peachPale },
  strength: { icon: 'barbell-outline', color: '#625986', pale: colors.lilacPale },
  mobility: { icon: 'body-outline', color: '#59776D', pale: colors.sagePale },
  brick: { icon: 'layers-outline', color: '#805C70', pale: '#F1E5EC' },
  rest: { icon: 'moon-outline', color: colors.inkMuted, pale: colors.cream },
};

export function WorkoutCard({ workout, compact = false }: { workout: Workout; compact?: boolean }) {
  const meta = sportMeta[workout.sport];
  return (
    <Pressable onPress={() => router.push({ pathname: '/workout/[id]', params: { id: workout.id } })} style={({ pressed }) => [styles.card, pressed && { opacity: 0.72 }]}>
      <View style={[styles.icon, { backgroundColor: meta.pale }]}><Ionicons name={meta.icon} size={23} color={meta.color} /></View>
      <View style={styles.copy}>
        <Text style={styles.sport}>{workout.sport.toUpperCase()} · {workout.durationMinutes} MIN</Text>
        <Text style={styles.title} numberOfLines={compact ? 1 : 2}>{workout.title}</Text>
        {!compact ? <Text style={styles.purpose} numberOfLines={2}>{workout.purpose}</Text> : null}
        <View style={styles.meta}><Pill label={workout.zone} tone={workout.intensity === 'hard' ? 'peach' : 'sage'} />{workout.status === 'complete' ? <Pill label="Completed" icon="checkmark-circle" tone="blue" /> : null}</View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.sage} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 3 },
  sport: { ...type.label, color: colors.inkMuted, fontSize: 10 },
  title: { ...type.h3, color: colors.ink },
  purpose: { ...type.small, color: colors.inkMuted },
  meta: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs, flexWrap: 'wrap' },
});
