import { describe, expect, it } from 'vitest';
import { demoProfile } from '@/data/demo';
import { generateDailyMealPlan, groceryList, macroTargets, underFuelingFlags } from '@/engine/nutrition';

describe('nutrition engine', () => {
  it('periodizes carbohydrate upward for a long session', () => {
    expect(macroTargets(demoProfile, 150).carbs).toBeGreaterThan(macroTargets(demoProfile, 0).carbs);
  });

  it('respects a declared ingredient allergy', () => {
    const profile = { ...demoProfile, allergies: ['peanut'] };
    const plan = generateDailyMealPlan(profile, '2026-01-06');
    expect(plan.meals.flatMap((meal) => meal.ingredients).some((item) => item.includes('peanut'))).toBe(false);
  });

  it('deduplicates grocery items', () => {
    const plan = generateDailyMealPlan(demoProfile, '2026-01-06');
    const list = groceryList([plan, plan]);
    expect(new Set(list).size).toBe(list.length);
  });

  it('raises a professional-support safeguard when multiple under-fueling indicators exist', () => {
    const flags = underFuelingFlags({ missedPeriods: true, frequentInjuries: false, persistentFatigue: true, intentionalRestriction: false });
    expect(flags).toContain('professional-support-recommended');
  });
});

