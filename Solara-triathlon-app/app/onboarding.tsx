import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Choice, Field, Header, Pill, ProgressBar, Screen } from '@/components/ui';
import { colors, radius, spacing, type } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';

const steps = ['You', 'Race', 'Schedule', 'Training', 'Health', 'Nutrition'];

export default function OnboardingScreen() {
  const profile = useAppStore((state) => state.profile);
  const complete = useAppStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.firstName);
  const [age, setAge] = useState(String(profile.age));
  const [goal, setGoal] = useState(profile.goal);
  const [hours, setHours] = useState(String(profile.weeklyHours));
  const [cycleAware, setCycleAware] = useState(profile.cycleAware);
  const [diet, setDiet] = useState(profile.diet);
  const finish = () => {
    complete({ firstName: name || 'Athlete', age: Number(age) || 35, goal, weeklyHours: Number(hours) || 8, cycleAware, diet });
    router.replace('/(tabs)');
  };
  return (
    <Screen>
      <View style={styles.top}><Text style={styles.stepLabel}>STEP {step + 1} OF {steps.length}</Text><Text style={styles.stepName}>{steps[step]}</Text></View>
      <ProgressBar value={((step + 1) / steps.length) * 100} />
      {step === 0 ? <><Header title="Let’s start with you" subtitle="Only ask what helps your plan. You can change this later." /><Field label="First name" value={name} onChangeText={setName} /><Field label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" /><Choice label="Intermediate age-grouper" detail="I train consistently and have completed endurance events." selected /></> : null}
      {step === 1 ? <><Header title="What are we training for?" subtitle={`${profile.raceName} · ${profile.raceDate}`} />{(['finish', 'improve', 'PR', 'consistency', 'return'] as const).map((item) => <Choice key={item} label={{ finish: 'Finish feeling strong', improve: 'Improve my performance', PR: 'Set a personal record', consistency: 'Build consistency', return: 'Return from a break' }[item]} selected={goal === item} onPress={() => setGoal(item)} />)}</> : null}
      {step === 2 ? <><Header title="Fit training around life" subtitle="Your job and recovery belong in the plan—not outside it." /><Field label="Hours available per week" value={hours} onChangeText={setHours} keyboardType="decimal-pad" /><Choice selected label="AM weekday workouts" /><Choice selected label="Long ride Saturday" /><Choice selected label="Long run Sunday" /><View style={styles.pills}><Pill label="Pool M · W · F" tone="blue" /><Pill label="Gym T · Th" tone="lilac" /></View></> : null}
      {step === 3 ? <><Header title="Training setup" subtitle="Unknown thresholds are fine. Every workout also includes an RPE option." /><Choice selected label="Garmin watch + heart-rate monitor" /><Choice selected label="Indoor trainer" /><Choice selected label="Pool access" /><Choice selected label="Dumbbells + resistance bands" /><Field label="Bike FTP (optional)" placeholder="Leave blank if unknown" /><Field label="Run threshold pace (optional)" placeholder="e.g. 6:20 / km" /></> : null}
      {step === 4 ? <><Header title="Train with today’s body" subtitle="Cycle phase never automatically changes training. Symptoms and your preferences guide adjustments." /><Choice label="Use cycle and symptom data" detail="Optional, private, and revocable." selected={cycleAware} onPress={() => setCycleAware(!cycleAware)} /><Choice label="Occasional migraines" detail="We’ll use conservative, symptom-led rules and flag unusual symptoms." selected /><Choice label="No current injury restrictions" selected /><Text style={styles.safety}>Pregnancy, postpartum recovery, missed periods, suspected under-fueling, anemia, eating-disorder concerns, or persistent symptoms deserve support from an appropriately qualified professional.</Text></> : null}
      {step === 5 ? <><Header title="Fuel training—and the rest of life" subtitle="Everyday meals, workday snacks, hydration, recovery, workout fueling, and race practice." /><Field label="Dietary pattern" value={diet} onChangeText={setDiet} /><Choice selected label="Fuel training and improve energy" /><Choice selected label="3 meals + 2–3 snacks" /><Choice selected label="Meal prep twice per week" /><Text style={styles.safety}>We prioritize adequate energy, avoid aggressive restriction, and never label foods as good or bad.</Text></> : null}
      <View style={styles.actions}>{step > 0 ? <Button title="Back" variant="secondary" onPress={() => setStep(step - 1)} /> : null}<View style={{ flex: 1 }}><Button title={step === steps.length - 1 ? 'Generate my plan' : 'Continue'} onPress={() => step === steps.length - 1 ? finish() : setStep(step + 1)} /></View></View>
    </Screen>
  );
}

const styles = StyleSheet.create({ top: { flexDirection: 'row', justifyContent: 'space-between' }, stepLabel: { ...type.label, color: colors.forest }, stepName: { ...type.small, color: colors.inkMuted }, pills: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }, safety: { ...type.small, color: colors.inkMuted, backgroundColor: colors.cream, padding: spacing.md, borderRadius: radius.md }, actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md } });
