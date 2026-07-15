import { describe, expect, it } from 'vitest';
import { adaptMissedWorkout, adaptWorkoutForReadiness } from '@/engine/adaptation';
import { demoProfile } from '@/data/demo';
import { calculateReadiness } from '@/engine/readiness';
import { generatePlan } from '@/engine/training';

describe('adaptation', () => {
  const week = generatePlan(demoProfile, new Date('2026-01-05T12:00:00Z'))[0];

  it('creates a minimum effective version without cramming load', () => {
    const target = week.workouts[2];
    const result = adaptMissedWorkout(week, target.id, 'minimum');
    const updated = result.updatedWorkouts.find((workout) => workout.id === target.id)!;
    expect(updated.durationMinutes).toBeLessThan(target.durationMinutes);
    expect(result.loadChangeMinutes).toBeLessThan(0);
  });

  it('turns active migraine into rest rather than a diagnostic claim', () => {
    const readiness = calculateReadiness({ sleep: 3, stress: 2, soreness: 2, mood: 3, fatigue: 3, migraine: 'active', cycleSymptomSeverity: 1, underFueled: false, illnessSymptoms: false });
    const adjusted = adaptWorkoutForReadiness(week.workouts[0], readiness);
    expect(readiness.state).toBe('rest');
    expect(adjusted.sport).toBe('rest');
    expect(readiness.safetyMessage).toContain('not medical advice');
  });

  it('uses symptom impact, not cycle phase, to reduce readiness', () => {
    const mild = calculateReadiness({ sleep: 5, stress: 1, soreness: 1, mood: 5, fatigue: 1, migraine: 'none', cycleSymptomSeverity: 1, underFueled: false, illnessSymptoms: false });
    const material = calculateReadiness({ sleep: 5, stress: 1, soreness: 1, mood: 5, fatigue: 1, migraine: 'none', cycleSymptomSeverity: 5, underFueled: false, illnessSymptoms: false });
    expect(mild.score).toBeGreaterThan(material.score);
  });
});

