import { describe, expect, it } from 'vitest';
import { MockIntegrationAdapter } from '@/integrations/mock';
import { demoProfile } from '@/data/demo';
import { generatePlan } from '@/engine/training';

describe('mock integrations', () => {
  it('connects, reads activities, publishes a workout, and revokes access', async () => {
    const adapter = new MockIntegrationAdapter('garmin');
    expect((await adapter.status()).connected).toBe(false);
    await adapter.connect();
    expect((await adapter.activities('2026-01-01')).length).toBeGreaterThan(0);
    const workout = generatePlan(demoProfile)[0].workouts[0];
    expect((await adapter.publishWorkout(workout)).externalId).toContain(workout.id);
    expect((await adapter.disconnect()).permission).toBe('none');
  });
});

