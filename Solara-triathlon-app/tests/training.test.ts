import { describe, expect, it } from 'vitest';
import { demoProfile } from '@/data/demo';
import { generatePlan, intensityDistribution, weeklyProgressions } from '@/engine/training';

describe('training plan generation', () => {
  const plan = generatePlan(demoProfile, new Date('2026-01-05T12:00:00Z'));

  it('generates a complete periodized plan through race week', () => {
    expect(plan.length).toBeGreaterThanOrEqual(17);
    expect(plan[0].phase).toBe('base');
    expect(plan.at(-2)?.phase).toBe('taper');
    expect(plan.at(-1)?.phase).toBe('race');
    expect(plan.every((week) => week.workouts.some((workout) => workout.sport === 'strength'))).toBe(true);
  });

  it('inserts recovery weeks before taper', () => {
    const recovery = plan.filter((week) => week.isRecovery);
    expect(recovery.length).toBeGreaterThanOrEqual(3);
    expect(recovery.every((week) => week.phase === 'recovery')).toBe(true);
  });

  it('caps upward weekly progression at about ten percent', () => {
    const upward = weeklyProgressions(plan).filter((value) => value > 0);
    expect(upward.every((value) => value <= 0.101)).toBe(true);
  });

  it('keeps most endurance time low intensity', () => {
    const distribution = intensityDistribution(plan.slice(0, 3).flatMap((week) => week.workouts));
    expect(distribution.easyPercent).toBeGreaterThanOrEqual(70);
    expect(distribution.qualityPercent).toBeLessThanOrEqual(30);
  });
});

