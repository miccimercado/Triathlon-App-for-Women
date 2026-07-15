import { AthleteProfile, DailyMealPlan, Meal, Workout } from '@/types/domain';

const mealLibrary: Meal[] = [
  { id: 'm1', type: 'breakfast', title: 'Berry overnight oats', description: 'Oats, Greek yogurt, berries, chia and maple.', calories: 520, carbs: 79, protein: 27, fat: 12, prepMinutes: 8, ingredients: ['rolled oats', 'Greek yogurt', 'milk', 'berries', 'chia seeds', 'maple syrup'], tags: ['vegetarian', 'meal-prep'] },
  { id: 'm2', type: 'lunch', title: 'Roasted tofu grain bowl', description: 'Brown rice, tofu, edamame, greens and sesame-lime dressing.', calories: 680, carbs: 88, protein: 34, fat: 22, prepMinutes: 20, ingredients: ['brown rice', 'tofu', 'edamame', 'spinach', 'carrots', 'sesame dressing'], tags: ['vegetarian', 'work-lunch'] },
  { id: 'm3', type: 'dinner', title: 'Lemony lentil pasta', description: 'Pasta, lentils, spinach, parmesan and olive oil.', calories: 760, carbs: 112, protein: 35, fat: 20, prepMinutes: 25, ingredients: ['pasta', 'lentils', 'spinach', 'parmesan', 'lemon', 'olive oil'], tags: ['vegetarian', 'high-carb'] },
  { id: 'm4', type: 'snack', title: 'Banana & peanut butter', description: 'Portable carbohydrate with satisfying fat and protein.', calories: 240, carbs: 33, protein: 7, fat: 10, prepMinutes: 2, ingredients: ['banana', 'peanut butter'], tags: ['vegetarian', 'portable'] },
  { id: 'm5', type: 'snack', title: 'Yogurt crunch cup', description: 'Greek yogurt, granola and kiwi.', calories: 300, carbs: 42, protein: 20, fat: 6, prepMinutes: 3, ingredients: ['Greek yogurt', 'granola', 'kiwi'], tags: ['vegetarian', 'recovery'] },
  { id: 'm6', type: 'fuel', title: 'Toast with honey', description: 'Easy-to-digest pre-training carbohydrate.', calories: 220, carbs: 44, protein: 6, fat: 2, prepMinutes: 4, ingredients: ['bread', 'honey', 'salt'], tags: ['vegetarian', 'pre-workout'] },
];

export function macroTargets(profile: AthleteProfile, workoutMinutes = 60) {
  const kg = profile.weightKg || 60;
  const trainingHours = workoutMinutes / 60;
  const carbsPerKg = trainingHours >= 2 ? 7 : trainingHours >= 1 ? 5.5 : 4.2;
  const proteinPerKg = 1.7;
  const carbs = Math.round(kg * carbsPerKg);
  const protein = Math.round(kg * proteinPerKg);
  const fat = Math.round(kg * 1.1);
  const calories = Math.round((carbs * 4 + protein * 4 + fat * 9) / 50) * 50;
  return { calories, carbs, protein, fat };
}

export function generateDailyMealPlan(profile: AthleteProfile, date: string, workout?: Workout): DailyMealPlan {
  const minutes = workout?.durationMinutes || 0;
  const dayType: DailyMealPlan['dayType'] = minutes >= 120 ? 'long' : workout?.intensity === 'hard' ? 'quality' : minutes ? 'easy' : 'rest';
  const targets = macroTargets(profile, minutes);
  const meals = mealLibrary.filter((meal) => !meal.ingredients.some((ingredient) => profile.allergies.some((allergy) => ingredient.toLowerCase().includes(allergy.toLowerCase()))));
  const selected = meals.filter((meal) => dayType === 'long' || meal.type !== 'fuel');
  return {
    date,
    dayType,
    targets,
    meals: selected,
    hydrationLiters: Math.round(((profile.weightKg || 60) * 0.035 + Math.min(1.5, minutes / 90)) * 10) / 10,
    sodiumNote: minutes >= 90 ? 'Use your tested sodium range during training; sweat testing and conditions matter more than a universal target.' : 'Salt food to taste and adjust for heat and individual sweat losses.',
    why: dayType === 'long' ? 'Today is higher in carbohydrate to support the long session, recovery, and tomorrow’s training.' : dayType === 'rest' ? 'Regular meals still support recovery; carbohydrate is moderate, not removed.' : 'Meals are timed to support training energy, workday focus, and recovery.',
  };
}

export function groceryList(plans: DailyMealPlan[]): string[] {
  return [...new Set(plans.flatMap((plan) => plan.meals.flatMap((meal) => meal.ingredients)))].sort();
}

export function underFuelingFlags(input: { missedPeriods: boolean; frequentInjuries: boolean; persistentFatigue: boolean; intentionalRestriction: boolean }): string[] {
  const flags = Object.entries(input).filter(([, value]) => value).map(([key]) => key);
  if (flags.length >= 2) flags.push('professional-support-recommended');
  return flags;
}

export { mealLibrary };
