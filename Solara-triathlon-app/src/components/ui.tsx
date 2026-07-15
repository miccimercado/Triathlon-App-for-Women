import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing, type } from '@/theme/tokens';

export function Screen({ children, scroll = true, style }: { children: ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle> }) {
  const content = <View style={[styles.screenContent, style]}>{children}</View>;
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {scroll ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

export function Header({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function Card({ children, style, tone = 'white' }: { children: ReactNode; style?: StyleProp<ViewStyle>; tone?: 'white' | 'sage' | 'peach' | 'lilac' | 'blue' }) {
  const toneColor = { white: colors.white, sage: colors.sagePale, peach: colors.peachPale, lilac: colors.lilacPale, blue: colors.bluePale }[tone];
  return <View style={[styles.card, { backgroundColor: toneColor }, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = 'primary', icon, disabled, loading }: { title: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: keyof typeof Ionicons.glyphMap; disabled?: boolean; loading?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles[`button_${variant}`], (pressed || disabled) && styles.buttonPressed]}
    >
      {loading ? <ActivityIndicator color={variant === 'primary' ? colors.white : colors.forest} /> : icon ? <Ionicons name={icon} size={18} color={variant === 'primary' ? colors.white : variant === 'danger' ? colors.red : colors.forest} /> : null}
      <Text style={[styles.buttonText, styles[`buttonText_${variant}`]]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.iconButton}>
      <Ionicons name={icon} size={21} color={colors.forestDeep} />
    </Pressable>
  );
}

export function Pill({ label, tone = 'sage', icon }: { label: string; tone?: 'sage' | 'peach' | 'lilac' | 'blue' | 'neutral'; icon?: keyof typeof Ionicons.glyphMap }) {
  const backgrounds = { sage: colors.sagePale, peach: colors.peachPale, lilac: colors.lilacPale, blue: colors.bluePale, neutral: colors.cream };
  return (
    <View style={[styles.pill, { backgroundColor: backgrounds[tone] }]}>
      {icon ? <Ionicons name={icon} size={13} color={colors.ink} /> : null}
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.h2}>{title}</Text>
      {action ? <Pressable onPress={onAction}><Text style={styles.link}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function Field({ label, hint, ...props }: TextInputProps & { label: string; hint?: string }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput placeholderTextColor={colors.inkMuted} style={styles.field} {...props} />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function Choice({ label, selected, onPress, detail }: { label: string; selected?: boolean; onPress?: () => void; detail?: string }) {
  return (
    <Pressable onPress={onPress} style={[styles.choice, selected && styles.choiceSelected]}>
      <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.choiceLabel}>{label}</Text>
        {detail ? <Text style={styles.hint}>{detail}</Text> : null}
      </View>
    </Pressable>
  );
}

export function Metric({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <View style={[styles.metric, accent ? { borderTopColor: accent } : undefined]}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value, color = colors.forest }: { value: number; color?: string }) {
  return <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }]} /></View>;
}

export function HeroGradient({ children }: { children: ReactNode }) {
  return <LinearGradient colors={[colors.sagePale, colors.cream, colors.peachPale]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>{children}</LinearGradient>;
}

export function EmptyState({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  return <Card style={styles.empty}><Ionicons name={icon} size={30} color={colors.sage} /><Text style={styles.h3}>{title}</Text><Text style={styles.emptyBody}>{body}</Text></Card>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  scroll: { paddingBottom: 120 },
  screenContent: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md, marginBottom: spacing.sm },
  headerCopy: { flex: 1 },
  eyebrow: { ...type.label, color: colors.forest, marginBottom: spacing.xs },
  title: { ...type.h1, color: colors.ink },
  subtitle: { ...type.body, color: colors.inkMuted, marginTop: spacing.sm },
  h2: { ...type.h2, color: colors.ink },
  h3: { ...type.h3, color: colors.ink },
  card: { borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  button: { minHeight: 52, borderRadius: radius.md, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm },
  button_primary: { backgroundColor: colors.forestDeep },
  button_secondary: { backgroundColor: colors.sagePale, borderWidth: 1, borderColor: colors.sage },
  button_ghost: { backgroundColor: 'transparent' },
  button_danger: { backgroundColor: colors.redPale, borderWidth: 1, borderColor: '#EAC5BF' },
  buttonPressed: { opacity: 0.68, transform: [{ scale: 0.99 }] },
  buttonText: { ...type.body, fontWeight: '700' },
  buttonText_primary: { color: colors.white },
  buttonText_secondary: { color: colors.forestDeep },
  buttonText_ghost: { color: colors.forest },
  buttonText_danger: { color: colors.red },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  pill: { alignSelf: 'flex-start', borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: 10, paddingVertical: 6 },
  pillText: { ...type.small, color: colors.ink },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  link: { ...type.small, color: colors.forest, fontWeight: '700' },
  fieldWrap: { gap: 6 },
  fieldLabel: { ...type.small, color: colors.ink, fontWeight: '700' },
  field: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: spacing.lg, ...type.body, color: colors.ink },
  hint: { ...type.small, color: colors.inkMuted },
  choice: { minHeight: 58, padding: spacing.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  choiceSelected: { borderColor: colors.forest, backgroundColor: colors.sagePale },
  choiceLabel: { ...type.body, color: colors.ink, fontWeight: '600' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.forest },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.forest },
  metric: { flex: 1, minWidth: 92, borderTopWidth: 3, borderTopColor: colors.sage, paddingTop: spacing.md },
  metricValue: { ...type.h2, color: colors.ink },
  metricLabel: { ...type.small, color: colors.inkMuted, marginTop: 2 },
  progressTrack: { height: 7, borderRadius: radius.pill, backgroundColor: colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radius.pill },
  hero: { borderRadius: radius.xl, padding: spacing.xl, overflow: 'hidden' },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxxl },
  emptyBody: { ...type.body, color: colors.inkMuted, textAlign: 'center', maxWidth: 290 },
});
