import { AthleteProfile, PlanWeek, TrainingPhase, Workout } from '@/types/domain';
import { addDays, isoDate, startOfWeek, weeksBetween } from './date';

type WorkoutSeed = Omit<Workout, 'id' | 'date'> & { day: number };

const baseWeek: WorkoutSeed[] = [
  { day: 0, sport: 'swim', title: 'Form & aerobic swim', purpose: 'Build relaxed efficiency and sustainable aerobic fitness.', durationMinutes: 45, intensity: 'easy', zone: 'Z1–Z2', priority: 3, steps: [{ order: 1, label: 'Easy warm-up + drills', minutes: 12, zone: 'RPE 2–3' }, { order: 2, label: 'Smooth aerobic repeats', minutes: 25, zone: 'CSS + 8–12s/100m' }, { order: 3, label: 'Easy cool-down', minutes: 8, zone: 'RPE 2' }], why: 'Technique under low fatigue builds economy without adding unnecessary stress.', fueling: 'A normal meal 2–3 hours before is usually enough. Bring water.', recovery: 'Eat a meal or snack with carbohydrate and protein within your normal routine.', variants: { full: 45, short: 30, lowEnergy: 20 } },
  { day: 1, sport: 'strength', title: 'Stable & strong', purpose: 'Build posterior-chain strength, trunk control, and single-leg stability.', durationMinutes: 40, intensity: 'moderate', zone: 'RPE 6–7', priority: 2, steps: [{ order: 1, label: 'Mobility warm-up', minutes: 7, zone: 'Easy' }, { order: 2, label: 'Squat, hinge & split squat', minutes: 22, zone: '2–3 sets × 6–10' }, { order: 3, label: 'Pull, press & anti-rotation core', minutes: 11, zone: '2–3 sets × 8–12' }], why: 'Consistent strength work supports durability and force production across all three sports.', fueling: 'Avoid starting hungry. A carbohydrate-rich snack is useful after a long gap between meals.', recovery: 'Include 25–35 g protein in the next meal plus carbohydrate according to the day’s training.', variants: { full: 40, short: 25, lowEnergy: 15 } },
  { day: 2, sport: 'bike', title: 'Aerobic cadence ride', purpose: 'Accumulate low-intensity volume while practicing an efficient pedal stroke.', durationMinutes: 60, intensity: 'easy', zone: 'Power Z2 · RPE 3', priority: 2, steps: [{ order: 1, label: 'Easy spin', minutes: 10, zone: 'Z1' }, { order: 2, label: 'Aerobic ride + cadence lifts', minutes: 42, zone: 'Z2' }, { order: 3, label: 'Cool-down', minutes: 8, zone: 'Z1' }], why: 'Easy aerobic work is the foundation of long-course endurance.', fueling: 'Water is usually sufficient; add 20–30 g carbohydrate if hungry or training before breakfast.', recovery: 'Resume normal meals; include carbohydrate at the next meal.', variants: { full: 60, short: 40, lowEnergy: 25 } },
  { day: 3, sport: 'run', title: 'Controlled tempo', purpose: 'Improve sustainable speed without turning the session into a race.', durationMinutes: 50, intensity: 'hard', zone: 'Z3 · RPE 6–7', priority: 1, steps: [{ order: 1, label: 'Easy run + strides', minutes: 15, zone: 'Z1–Z2' }, { order: 2, label: '3 × 6 min controlled tempo', minutes: 24, zone: 'Z3 / 2 min easy' }, { order: 3, label: 'Easy cool-down', minutes: 11, zone: 'Z1' }], why: 'A small dose of controlled intensity develops threshold while preserving recovery.', fueling: 'Have 30–60 g carbohydrate 30–90 minutes before if the last meal was more than three hours ago.', recovery: 'Within two hours, eat carbohydrate plus 25–35 g protein and fluids.', variants: { full: 50, short: 35, lowEnergy: 25 } },
  { day: 4, sport: 'swim', title: 'Endurance swim', purpose: 'Develop steady swim durability with shoulder-friendly technique.', durationMinutes: 50, intensity: 'easy', zone: 'Z2 · RPE 3–4', priority: 2, steps: [{ order: 1, label: 'Warm-up', minutes: 10, zone: 'Easy' }, { order: 2, label: 'Steady aerobic set', minutes: 32, zone: 'CSS + 6–10s/100m' }, { order: 3, label: 'Cool-down', minutes: 8, zone: 'Easy' }], why: 'Frequent, manageable swim exposure improves comfort and consistency.', fueling: 'Keep meals regular; carry water to the pool.', recovery: 'Normal balanced meal; include a protein source.', variants: { full: 50, short: 35, lowEnergy: 20 } },
  { day: 5, sport: 'brick', title: 'Long ride + transition run', purpose: 'Build race-specific endurance and practice fueling and transitions.', durationMinutes: 150, intensity: 'easy', zone: 'Z2 · RPE 3–4', priority: 1, steps: [{ order: 1, label: 'Easy ride', minutes: 15, zone: 'Z1–Z2' }, { order: 2, label: 'Steady endurance ride', minutes: 115, zone: 'Z2' }, { order: 3, label: 'Quick transition run', minutes: 20, zone: 'Easy RPE 3' }], why: 'The long brick develops durability and lets you rehearse pacing, fueling, and the bike-to-run transition.', fueling: 'Start fueled. Practice 60–75 g carbohydrate/hour on the bike, fluid to thirst, and your individualized sodium plan.', recovery: 'Eat a carbohydrate-rich meal with 25–35 g protein, rehydrate, and include sodium based on losses.', variants: { full: 150, short: 100, lowEnergy: 60 } },
  { day: 6, sport: 'run', title: 'Easy long run', purpose: 'Build run endurance on already-trained legs at a sustainable effort.', durationMinutes: 75, intensity: 'easy', zone: 'Z2 · RPE 3–4', priority: 1, steps: [{ order: 1, label: 'Gentle start', minutes: 10, zone: 'Z1' }, { order: 2, label: 'Comfortable endurance', minutes: 55, zone: 'Z2' }, { order: 3, label: 'Easy finish + walk', minutes: 10, zone: 'Z1' }], why: 'Easy long running builds resilience while keeping intensity controlled.', fueling: 'Have carbohydrate before. For runs beyond 75 minutes, practice 30–60 g carbohydrate/hour.', recovery: 'Replace fluids and eat carbohydrate plus protein in the next meal.', variants: { full: 75, short: 50, lowEnergy: 30 } },
];

export const DEFAULT_RULES = {
  intensityEasyTarget: 0.8,
  weeklyLoadCap: 0.1,
  recoveryEveryWeeks: 4,
  recoveryReduction: 0.22,
  taperWeeks: 2,
};

function phaseForWeek(index: number, totalWeeks: number, recovery: boolean): TrainingPhase {
  if (index === totalWeeks - 1) return 'race';
  if (index >= totalWeeks - 1 - DEFAULT_RULES.taperWeeks) return 'taper';
  if (recovery) return 'recovery';
  const progress = index / Math.max(1, totalWeeks - DEFAULT_RULES.taperWeeks - 1);
  if (progress < 0.42) return 'base';
  if (progress < 0.8) return 'build';
  return 'peak';
}

function phaseMultiplier(phase: TrainingPhase): number {
  return { base: 0.82, build: 0.95, peak: 1, taper: 0.64, race: 0.42, recovery: 0.74 }[phase];
}

export function generatePlan(profile: AthleteProfile, today = new Date()): PlanWeek[] {
  const planStart = startOfWeek(today);
  const race = new Date(`${profile.raceDate}T12:00:00Z`);
  const totalWeeks = Math.min(30, weeksBetween(planStart, race));
  let previousHours = Math.max(4.5, profile.weeklyHours * 0.72);

  return Array.from({ length: totalWeeks }, (_, index) => {
    const isRecovery = index > 0 && (index + 1) % DEFAULT_RULES.recoveryEveryWeeks === 0 && index < totalWeeks - 3;
    const phase = phaseForWeek(index, totalWeeks, isRecovery);
    const progressive = profile.weeklyHours * (0.74 + Math.min(0.26, index * 0.023));
    let targetHours = Math.min(profile.weeklyHours, progressive, previousHours * (1 + DEFAULT_RULES.weeklyLoadCap));
    targetHours *= phaseMultiplier(phase);
    if (isRecovery) targetHours *= 1 - DEFAULT_RULES.recoveryReduction;
    targetHours = Math.round(targetHours * 10) / 10;
    previousHours = targetHours;
    const weekStart = addDays(planStart, index * 7);
    const scale = (targetHours * 60) / baseWeek.reduce((sum, workout) => sum + workout.durationMinutes, 0);
    const workouts = baseWeek.map((seed, workoutIndex): Workout => {
      const isStrength = seed.sport === 'strength';
      const shouldEase = phase === 'taper' || phase === 'race' || isRecovery;
      const duration = Math.max(15, Math.round(seed.durationMinutes * scale * (isStrength && shouldEase ? 0.7 : 1) / 5) * 5);
      return {
        ...seed,
        id: `w${index + 1}-${workoutIndex + 1}`,
        date: isoDate(addDays(weekStart, seed.day)),
        durationMinutes: duration,
        variants: { full: duration, short: Math.max(20, Math.round(duration * 0.67 / 5) * 5), lowEnergy: Math.max(15, Math.round(duration * 0.42 / 5) * 5) },
        title: phase === 'race' && seed.day === profile.longRideDay ? '70.3 race day' : seed.title,
      };
    });
    return { index: index + 1, phase, startDate: isoDate(weekStart), targetHours, isRecovery, workouts };
  });
}

export function intensityDistribution(workouts: Workout[]) {
  const totals = workouts.reduce((acc, workout) => {
    acc.total += workout.durationMinutes;
    if (workout.intensity === 'easy') acc.easy += workout.durationMinutes;
    else acc.quality += workout.durationMinutes;
    return acc;
  }, { easy: 0, quality: 0, total: 0 });
  return { ...totals, easyPercent: totals.total ? Math.round((totals.easy / totals.total) * 100) : 0, qualityPercent: totals.total ? Math.round((totals.quality / totals.total) * 100) : 0 };
}

export function weeklyProgressions(plan: PlanWeek[]): number[] {
  return plan.slice(1).map((week, index) => (week.targetHours - plan[index].targetHours) / plan[index].targetHours);
}
