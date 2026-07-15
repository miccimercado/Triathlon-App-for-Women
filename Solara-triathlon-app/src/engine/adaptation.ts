import { PlanWeek, ReadinessResult, Workout } from '@/types/domain';

export type AdaptationChoice = 'keep' | 'reschedule' | 'minimum' | 'recovery';

export interface AdaptationResult {
  action: AdaptationChoice;
  updatedWorkouts: Workout[];
  explanation: string;
  loadChangeMinutes: number;
}

export function adaptMissedWorkout(week: PlanWeek, missedId: string, choice: AdaptationChoice): AdaptationResult {
  const missed = week.workouts.find((workout) => workout.id === missedId);
  if (!missed) throw new Error('Workout not found');
  const updated = week.workouts.map((workout) => ({ ...workout }));
  const target = updated.find((workout) => workout.id === missedId)!;
  target.status = 'missed';

  if (choice === 'keep') return { action: choice, updatedWorkouts: updated, explanation: 'The rest of the week stays unchanged. One missed session will not erase your fitness.', loadChangeMinutes: -missed.durationMinutes };
  if (choice === 'minimum') {
    target.status = 'planned';
    target.durationMinutes = target.variants.lowEnergy;
    target.title = `Minimum effective · ${target.title}`;
    return { action: choice, updatedWorkouts: updated, explanation: 'We kept the movement pattern but reduced duration and removed pressure to make up volume.', loadChangeMinutes: target.durationMinutes - missed.durationMinutes };
  }
  if (choice === 'recovery') {
    target.sport = 'mobility'; target.status = 'planned'; target.title = 'Restore & reset'; target.durationMinutes = 20; target.intensity = 'easy'; target.zone = 'Very easy';
    target.purpose = 'Support recovery without adding meaningful training load.';
    return { action: choice, updatedWorkouts: updated, explanation: 'We replaced the session with gentle recovery. The next key session remains protected.', loadChangeMinutes: 20 - missed.durationMinutes };
  }

  const candidates = updated.filter((workout) => workout.id !== missedId && workout.priority === 3 && workout.status !== 'complete');
  const replacement = candidates[0];
  if (replacement) {
    target.date = replacement.date;
    replacement.status = 'missed';
    return { action: choice, updatedWorkouts: updated, explanation: `We moved the higher-priority session to ${replacement.date} and removed a lower-priority session. Recovery spacing is preserved.`, loadChangeMinutes: -replacement.durationMinutes };
  }
  return { action: choice, updatedWorkouts: updated, explanation: 'There is no safe low-priority slot this week, so the missed session stays missed. We did not cram it beside another key workout.', loadChangeMinutes: -missed.durationMinutes };
}

export function adaptWorkoutForReadiness(workout: Workout, readiness: ReadinessResult): Workout {
  if (readiness.state === 'ready' || readiness.state === 'steady') return workout;
  if (readiness.state === 'reduce') return { ...workout, title: `Adjusted · ${workout.title}`, durationMinutes: workout.variants.lowEnergy, intensity: 'easy', zone: 'RPE 2–3', purpose: `${workout.purpose} Today, effort is capped to protect recovery.` };
  return { ...workout, sport: 'rest', title: 'Recovery day', purpose: readiness.action, durationMinutes: 0, intensity: 'easy', zone: 'Rest', steps: [], fueling: 'Keep meals and fluids regular as tolerated.', recovery: 'Rest and reassess symptoms. Seek professional guidance for concerning symptoms.' };
}

