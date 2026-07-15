export type Sport = 'swim' | 'bike' | 'run' | 'strength' | 'mobility' | 'brick' | 'rest';
export type TrainingPhase = 'base' | 'build' | 'peak' | 'taper' | 'race' | 'recovery';
export type Intensity = 'easy' | 'moderate' | 'hard';

export interface WorkoutStep {
  order: number;
  label: string;
  minutes: number;
  zone: string;
  target?: string;
}

export interface Workout {
  id: string;
  date: string;
  sport: Sport;
  title: string;
  purpose: string;
  durationMinutes: number;
  intensity: Intensity;
  zone: string;
  steps: WorkoutStep[];
  why: string;
  fueling: string;
  recovery: string;
  priority: 1 | 2 | 3;
  status?: 'planned' | 'complete' | 'missed' | 'shortened';
  variants: { full: number; short: number; lowEnergy: number };
}

export interface PlanWeek {
  index: number;
  phase: TrainingPhase;
  startDate: string;
  targetHours: number;
  isRecovery: boolean;
  workouts: Workout[];
}

export interface AthleteProfile {
  id: string;
  firstName: string;
  age: number;
  raceName: string;
  raceDate: string;
  goal: 'finish' | 'improve' | 'PR' | 'consistency' | 'return';
  weeklyHours: number;
  experience: 'beginner' | 'intermediate' | 'advanced';
  longRideDay: number;
  longRunDay: number;
  poolDays: number[];
  gymDays: number[];
  diet: string;
  allergies: string[];
  weightKg?: number;
  cycleAware: boolean;
  migraineFrequency: 'none' | 'occasional' | 'frequent';
}

export interface ReadinessInput {
  sleep: number;
  stress: number;
  soreness: number;
  mood: number;
  fatigue: number;
  hrvStatus?: 'below' | 'normal' | 'above';
  restingHeartRateDelta?: number;
  migraine: 'none' | 'warning' | 'active' | 'recovery';
  cycleSymptomSeverity: number;
  underFueled: boolean;
  illnessSymptoms: boolean;
  redFlags?: string[];
}

export interface ReadinessResult {
  score: number;
  state: 'ready' | 'steady' | 'reduce' | 'rest';
  headline: string;
  reasons: string[];
  action: string;
  safetyMessage?: string;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'fuel';
  title: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  prepMinutes: number;
  ingredients: string[];
  tags: string[];
}

export interface DailyMealPlan {
  date: string;
  dayType: 'rest' | 'easy' | 'quality' | 'long';
  targets: { calories: number; carbs: number; protein: number; fat: number };
  meals: Meal[];
  hydrationLiters: number;
  sodiumNote: string;
  why: string;
}

export interface IntegrationStatus {
  provider: 'garmin' | 'apple' | 'strava' | 'trainingpeaks' | 'calendar';
  connected: boolean;
  mode: 'mock' | 'live';
  lastSync?: string;
  permission: 'none' | 'partial' | 'granted';
  error?: string;
}
